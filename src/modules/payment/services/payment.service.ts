import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { PaymentAdapterFactory } from '../factories/payment-adapter.factory';
import { CartService } from 'src/modules/cart/services/cart.service';
import { ProductService } from 'src/modules/products/services/product.service';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { ProductRepository } from 'src/modules/products/repositories/product.repository';
import { options } from 'joi';

@Injectable()
export class PaymentService {
 
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly paymentAdapterFactory: PaymentAdapterFactory,
    private readonly _cartService: CartService,
    private readonly dataSource: DataSource,
    private readonly _productRepo: ProductRepository,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const adapter = this.paymentAdapterFactory.getAdapter(
      createPaymentDto.provider,
    );

    const cart = await this._cartService.getById(createPaymentDto.CartId, {
      options: { relations: ['items'] },
    });
    if (!cart) throw new NotFoundException('Cart not found');

    const totalAmount = await this.validateCart(cart);

    return await this.dataSource.transaction(async (manager) => {
      const payment = await this.createPaymentEntity(
        createPaymentDto,
       // cart.userId,
         
        totalAmount,
        manager.getRepository(PaymentEntity),
      );

      return await this.processPaymentAdapter(payment, cart, adapter);
    });
  }

  private async validateCart(cart: CartEntity): Promise<number> {
    if (!cart.isActive) throw new BadRequestException('Cart is inactive');
    if (!cart.items?.length) throw new BadRequestException('Cart is empty');

    // Avoid N+1: fetch all products in one query have used batch fetchin for base repo
    const productIds = cart.items.map((item) => item.productId);
    const products = await this._productRepo._findByIds(productIds, {
      options: { relations: { variants: true } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalAmount = 0;

    for (const item of cart.items) {
      const product = productMap.get(item.productId);
      if (!product)
        throw new BadRequestException(`Product ${item.productId} not found`);

      this.ensureProductIsValid(product);
      const price = this.calculateProductPrice(product);

      if (item.variantId) {
        this.validateVariant(item, product);
      }

      totalAmount += price * item.quantity;
    }

    if (totalAmount <= 0)
      throw new BadRequestException('Total amount cannot be zero');
    return totalAmount;
  }

  // --------------------- Private helpers ---------------------

  private ensureProductIsValid(product: ProductEntity) {
    if (product.price == null || product.price <= 0)
      throw new BadRequestException(
        `Invalid price for product ${product.name}`,
      );
  }

  private calculateProductPrice(product: ProductEntity): number {
    const now = new Date();
    let price = product.price;

    if (
      product.discountValue &&
      product.discountStartDate &&
      product.discountEndDate
    ) {
      if (now >= product.discountStartDate && now <= product.discountEndDate) {
        price -= product.discountValue;
        if (price < 0)
          throw new BadRequestException(
            `Discount exceeds price for product: ${product.name}`,
          );
      }
    }

    return price;
  }
  //for stock valadation remaining
  private validateVariant(item: any, product: ProductEntity) {
    console.log('🔍 Checking variant ID match...');
    console.log(
      'Product Variants IDs:',
      product.variants?.map((v) => v.id),
    );
    console.log('Item Variant ID:', item.variantId);
    //const variant = product.variants?.find((v) => v.id === item.variantId);
    //if (!variant) throw new BadRequestException(`Invalid variant for product: ${product.name}`);
    // const variant = product.variants?.find((v) => v.id === item.variantId);
    // if (!variant) throw new BadRequestException(`Invalid variant for product: ${product.name}`);

    // if (variant.quantity < item.quantity)
    //   throw new BadRequestException(
    //   `Not enough stock for variant ${variant.id}. Available: ${variant.quantity}`,
    //   );
  }

  private async createPaymentEntity(
    dto: CreatePaymentDto,
    totalAmount: number,
    paymentRepo: Repository<PaymentEntity>,
  ): Promise<PaymentEntity> {
    const payment = paymentRepo.create({
      userId: dto.userId,
      amount: totalAmount,
      currency: dto.currency,
      provider: dto.provider,
      description: dto.description,
      status: PaymentStatus.PENDING,
      metadata: dto.metadata,
    });

    return await paymentRepo.save(payment);
  }

  private async processPaymentAdapter(
    payment: PaymentEntity,
    cart: CartEntity,
    adapter: any,
  ): Promise<PaymentResponseDto> {
    try {
      const result = await adapter.createPayment({ ...payment }, cart);

      payment.status = result.success ? result.status : PaymentStatus.FAILED;
      if (result.success) {
        payment.providerPaymentId = result.paymentId;
        payment.providerTransactionId = result.transactionId ?? '';
        if (result.metadata)
          payment.metadata = { ...payment.metadata, ...result.metadata };
      } else {
        throw new BadRequestException(result.errorMessage);
      }

      await this.paymentRepository.save(payment);

      return {
        ...payment,
        id: payment.id.toString(),
        userId: payment.userId.toString(),
        checkoutUrl: result.checkoutUrl,
      };
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = error.message;
      await this.paymentRepository.save(payment);
       throw new InternalServerErrorException(error.message);
    }
  }
}
