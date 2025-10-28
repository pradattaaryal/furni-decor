import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  PaymentEntity,
  PaymentStatus,
  PaymentProvider,
} from '../entities/payment.entity';
import { PaymentAdapterFactory } from '../factories/payment-adapter.factory';
import { OrderService } from 'src/modules/order/services/order.service';
import { ORDER_STATUS } from 'src/modules/order/constant/order.constant';
import { CartService } from 'src/modules/cart/services/cart.service';
import { CartItemService } from 'src/modules/cart-item/services/cart-item.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    private paymentAdapterFactory: PaymentAdapterFactory,
    private orderService: OrderService,
    private cartService: CartService,
    private cartItemService: CartItemService,
    private dataSource: DataSource,
  ) { }

  async handleStripeWebhook(payload: any, signature: string): Promise<void> {
    const adapter = this.paymentAdapterFactory.getAdapter(
      PaymentProvider.STRIPE,
    );

    const event = adapter.verifyWebhook(payload, signature);

    if (!event) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const paymentIntent = event.data.object;
    const paymentId = paymentIntent.id;

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentCompletion(paymentId, PaymentProvider.STRIPE);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(
          paymentId,
          paymentIntent.last_payment_error?.message || 'Unknown error',
          PaymentProvider.STRIPE,
        );
        break;

      case 'payment_intent.canceled':
        await this.handlePaymentCancellation(paymentId, PaymentProvider.STRIPE);
        break;

      default:
        throw new BadRequestException(
          `Unhandled event type: ${event.type} for payment: ${paymentId}`,
        );
    }
  }

  async handlePayPalWebhook(payload: any, signature: string): Promise<void> {
    const adapter = this.paymentAdapterFactory.getAdapter(
      PaymentProvider.PAYPAL,
    );

    switch (payload.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await this.handlePaymentCompletion(
          payload.resource.id,
          PaymentProvider.PAYPAL,
        );
        break;

      default:
        throw new BadRequestException(
          `Unhandled PayPal event type: ${payload.event_type}`,
        );
    }
  }

  async handlePaymentCompletion(
    providerPaymentId: string,
    provider: PaymentProvider,
  ): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const paymentRepo = manager.getRepository(PaymentEntity);

      // Find payment with lock to prevent race conditions
      const payment = await paymentRepo.findOne({
        where: { providerPaymentId, provider },
      });

      if (!payment) {
        throw new NotFoundException(`Payment not found: ${providerPaymentId}`);
      }

      // Check if payment is already completed (prevent duplicate processing)
      if (payment.status === PaymentStatus.COMPLETED) {
        this.logger.warn(
          `Payment ${providerPaymentId} already completed. Skipping duplicate processing.`,
        );
        return;
      }

      // Update payment status
      payment.status = PaymentStatus.COMPLETED;
      await paymentRepo.save(payment);

      // Update order status
      await this.updateOrderStatus(payment, ORDER_STATUS.ORDER_COMPLETED);

      // Clear the cart
      await this.clearCart(payment);
    });
  }

  //for payment intent failed
  private async handlePaymentSuccess(
    providerPaymentId: string,
    provider: PaymentProvider,
  ): Promise<void> {
    await this.handlePaymentCompletion(providerPaymentId, provider);
  }

  private async handlePaymentFailure(
    providerPaymentId: string,
    errorMessage: string,
    provider: PaymentProvider,
  ): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { providerPaymentId, provider },
    });

    if (!payment) {
      throw new NotFoundException(`Payment not found: ${providerPaymentId}`);
    }

    payment.status = PaymentStatus.FAILED;
    payment.failureReason = errorMessage;
    await this.paymentRepository.save(payment);
  }
  //handle the payment cancellation
  private async handlePaymentCancellation(
    providerPaymentId: string,
    provider: PaymentProvider,
  ): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { providerPaymentId, provider },
    });

    if (!payment) {
      throw new NotFoundException(`Payment not found: ${providerPaymentId}`);
    }

    payment.status = PaymentStatus.CANCELLED;
    await this.paymentRepository.save(payment);

    await this.updateOrderStatus(payment, ORDER_STATUS.ORDER_CANCELLED);
  }
  //update the order status
  private async updateOrderStatus(
    payment: PaymentEntity,
    orderStatus: ORDER_STATUS,
  ): Promise<void> {
    console.log(payment.metadata);
    const orderId = payment.metadata?.orderId;
    if (!orderId) {
      throw new BadRequestException(
        `No orderId found in payment metadata for payment ${payment.id}`,
      );
    }

    const orderIdNumber = parseInt(orderId, 10);
    await this.orderService.updateStatus(orderIdNumber, orderStatus);
  }
  //clear cart after payment completion
  private async clearCart(payment: PaymentEntity): Promise<void> {
    try {
      const cart = await this.cartService.getOne({
        options: {
          where: { userId: payment.userId },
          relations: ['items'],
        },
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        this.logger.log(`No cart items found for user ${payment.userId}`);
        return;
      }

      // Delete all cart items
      for (const item of cart.items) {
        await this.cartItemService.delete(item);
      }

      // Reset cart total price
      await this.cartService.update({ cartId: cart.id, totalPrice: 0 });

      this.logger.log(
        `Cart cleared successfully for user ${payment.userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to clear cart for user ${payment.userId}: ${error.message}`,
      );

    }
  }
}
