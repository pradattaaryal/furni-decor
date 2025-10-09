import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentAdapterInterface,
  PaymentResult,
  RefundResult,
} from '../interfaces/payment-adapter.interface';

import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import Stripe from 'stripe';
import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
import { OrderService } from 'src/modules/order/services/order.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class StripeAdapter implements PaymentAdapterInterface {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly _orderService: OrderService,
    // private readonly _cartService: CartService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('Stripe secret key is not configured');
    }

    this.stripe = new Stripe(secretKey);
  }

  async createPayment(
    payment: PaymentEntity,
    dto: CreatePaymentDto,
    cart: CartEntity,
  ): Promise<PaymentResult> {
    try {
      const { amount, currency = 'usd' } = payment;
      const userId = cart.userId;

      const order = await this._orderService.createOrder(
        userId,
        dto.shippingaddress,
      );
      if (!order) {
        throw new BadRequestException('Order creation failed');
      }

      const paymentIntentData = {
        amount: Math.round(amount * 100),
        currency,
        payment_method_types: ['card'],
        description: 'Purchase from Furni Decor',
        metadata: {
          cartId: String(cart.id),
          userId: String(userId),
          orderId: String(order.id),
        },
      };
      const idempotencyKey = `${order.id}-${userId}`;

      const paymentIntent = await this.stripe.paymentIntents.create(
        paymentIntentData,
        { idempotencyKey },
      );

      return {
        success: true,
        paymentId: paymentIntent.id,
        transactionId: paymentIntent.id,
        cart: cart,
        status: this.mapStripeStatus(paymentIntent.status),
        metadata: {
          clientSecret: paymentIntent.client_secret,
        },
      };
    } catch (error) {
      this.logger.error(
        'Stripe payment creation failed',
        error.stack || error.message,
      );

      return {
        success: false,
        paymentId: '',
        status: PaymentStatus.FAILED,
        errorMessage:
          error instanceof BadRequestException
            ? error.message
            : 'Payment creation failed. Please try again later.',
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentId);
      return this.mapStripeStatus(paymentIntent.status);
    } catch (error) {
      this.logger.error(
        `Failed to fetch payment status for ${paymentId}`,
        error,
      );
      throw new BadRequestException('Unable to retrieve payment status');
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<RefundResult> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        success: true,
        refundId: refund.id,
        amount: (refund.amount ?? 0) / 100,
        status: refund.status || 'Completed',
      };
    } catch (error) {
      this.logger.error(`Failed to refund payment ${paymentId}`, error);
      return {
        success: false,
        refundId: '',
        amount: 0,
        status: 'failed',
        errorMessage: error.message,
      };
    }
  }

  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await this.stripe.paymentIntents.cancel(paymentId);
      return true;
    } catch (error) {
      this.logger.error(`Failed to cancel payment ${paymentId}`, error);
      return false;
    }
  }

  verifyWebhook(payload: Buffer, signature: string): boolean {
    try {
      const endpointSecret = this.configService.get<string>(
        'STRIPE_WEBHOOK_SECRET',
      );
      if (!endpointSecret)
        throw new Error('Stripe webhook secret not configured');

      this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return true;
    } catch (error) {
      this.logger.warn('Webhook verification failed', error);
      return false;
    }
  }

  private mapStripeStatus(status: Stripe.PaymentIntent.Status): PaymentStatus {
    const map: Record<string, PaymentStatus> = {
      succeeded: PaymentStatus.COMPLETED,
      processing: PaymentStatus.PROCESSING,
      requires_payment_method: PaymentStatus.PENDING,
      requires_action: PaymentStatus.PENDING,
      canceled: PaymentStatus.CANCELLED,
      requires_capture: PaymentStatus.PENDING,
    };

    return map[status] || PaymentStatus.FAILED;
  }
}
