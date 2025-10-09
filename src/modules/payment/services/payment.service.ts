import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { PaymentAdapterFactory } from '../factories/payment-adapter.factory';
import { CartService } from 'src/modules/cart/services/cart.service';
import { ProductRepository } from 'src/modules/products/repositories/product.repository';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly paymentAdapterFactory: PaymentAdapterFactory,
    private readonly cartService: CartService,
    private readonly dataSource: DataSource,
    private readonly productRepo: ProductRepository,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const adapter = this.paymentAdapterFactory.getAdapter(dto.provider);

    const cart = await this.cartService.getById(dto.CartId, {
      options: { relations: ['items'] },
    });
    if (!cart) throw new NotFoundException('Cart not found');

    const totalAmount = await this.validateCart(cart);

    return this.dataSource.transaction(async (manager) => {
      const paymentRepo = manager.getRepository(PaymentEntity);

      const payment = await this.createPaymentEntity(
        dto,
        totalAmount,
        paymentRepo,
      );

      try {
        const result = await adapter.createPayment(payment, dto, cart);

        payment.status = result.success ? result.status : PaymentStatus.FAILED;

        if (result.success) {
          payment.providerPaymentId = result.paymentId;
          payment.providerTransactionId = result.transactionId ?? '';
          payment.metadata = {
            ...payment.metadata,
            ...result.metadata,
          };
        }

        await paymentRepo.save(payment);

        if (!result.cart) {
          throw new InternalServerErrorException(
            'Cart data is missing in the payment result.',
          );
        }
        return this.mapToResponseDto(
          result.cart,
          payment,
          result.checkoutUrl,
          'Payment initialized successfully',
        );
      } catch (error) {
        this.logger.error(`Payment processing failed: ${error.message}`);
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = error.message;
        await paymentRepo.save(payment);

        throw new InternalServerErrorException(
          'Payment processing failed. Please try again later.',
        );
      }
    });
  }

  // --------------------- Cart validation ---------------------
  private async validateCart(cart: CartEntity): Promise<number> {
    if (!cart.isActive) throw new BadRequestException('Cart is inactive');
    if (!cart.items?.length) throw new BadRequestException('Cart is empty');

    const productIds = cart.items.map((i) => i.productId);
    const products = await this.productRepo._findByIds(productIds, {
      options: { relations: { variants: true } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    for (const item of cart.items) {
      const product = productMap.get(item.productId);
      if (!product)
        throw new BadRequestException(`Product ${item.productId} not found`);

      this.validateProduct(product);
      const price = this.getProductPrice(product);

      if (item.variantId) this.validateVariant(item, product);

      total += price * item.quantity;
    }

    if (total <= 0)
      throw new BadRequestException('Total amount cannot be zero');
    return total;
  }

  private validateProduct(product: ProductEntity) {
    if (!product.price || product.price <= 0)
      throw new BadRequestException(
        `Invalid price for product ${product.name}`,
      );
  }

  private getProductPrice(product: ProductEntity): number {
    const now = new Date();
    let price = product.price;
    if (
      product.discountValue &&
      product.discountStartDate &&
      product.discountEndDate &&
      now >= product.discountStartDate &&
      now <= product.discountEndDate
    ) {
      price -= product.discountValue;
      if (price < 0)
        throw new BadRequestException(
          `Discount exceeds price for ${product.name}`,
        );
    }
    return price;
  }

  private validateVariant(item: any, product: ProductEntity) {
    const variant = product.variants?.find((v) => v.id === item.variantId);
    if (!variant)
      throw new BadRequestException(
        `Invalid variant for product ${product.name}`,
      );
    if (variant.quantity < item.quantity)
      throw new BadRequestException(
        `Not enough stock for variant ${variant.id}`,
      );
  }

  // --------------------- Helpers ---------------------

  private async createPaymentEntity(
    dto: CreatePaymentDto,
    amount: number,
    repo: Repository<PaymentEntity>,
  ) {
    const payment = repo.create({
      userId: dto.userId,
      amount,
      currency: dto.currency,
      provider: dto.provider,
      description: dto.description,
      status: PaymentStatus.PENDING,
      metadata: dto.metadata ?? {},
    });
    return repo.save(payment);
  }

  private mapToResponseDto(
    cart: CartEntity,
    payment: PaymentEntity,
    checkoutUrl?: string,
    message?: string,
  ): PaymentResponseDto {
    return {
      cart,
      id: payment.id.toString(),
      userId: payment.userId.toString(),
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      provider: payment.provider,
      providerPaymentId: payment.providerPaymentId,
      providerTransactionId: payment.providerTransactionId,
      checkoutUrl,
      description: payment.description,
      metadata: payment.metadata,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      message,
    };
  }
}
