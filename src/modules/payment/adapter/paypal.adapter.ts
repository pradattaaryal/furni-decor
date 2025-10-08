import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentAdapterInterface,
  PaymentResult,
  RefundResult,
} from '../interfaces/payment-adapter.interface';
import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { OrderService } from 'src/modules/order/services/order.service';
import { CartService } from 'src/modules/cart/services/cart.service';

@Injectable()
export class PayPalAdapter implements PaymentAdapterInterface {
  private readonly logger = new Logger(PayPalAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly _orderService: OrderService,
    private readonly _cartService: CartService,
  ) {
    this.logger.log('PayPal adapter initialized');
  }

  async createPayment(
    payment: PaymentEntity,
    dto: CreatePaymentDto,
    cart: CartEntity,
  ): Promise<PaymentResult> {
    try {
      const { amount, currency = 'USD' } = payment;
      const userId = cart.userId;

      // 🧾 Create order in your database before initiating payment
      const order = await this._orderService.createOrder(
        userId,
        dto.shippingaddress,
      );
      if (!order) throw new BadRequestException('Order creation failed');

      // ⚙️ Mock PayPal order creation (replace this with PayPal SDK/API call)
      const orderResponse = {
        id: `PAYPAL-${Date.now()}`,
        status: 'CREATED',
        links: [
          {
            rel: 'approve',
            href: `https://www.sandbox.paypal.com/checkoutnow?token=${Date.now()}`,
          },
        ],
      };

      // ✅ Unified response structure — same as StripeAdapter
      return {
        success: true,
        paymentId: orderResponse.id,
        transactionId: orderResponse.id,
        cart,
        status: this.mapPayPalStatus(orderResponse.status),
        metadata: {
          checkoutUrl: orderResponse.links[0].href, // different from Stripe’s clientSecret
        },
      };
    } catch (error) {
      this.logger.error(
        'PayPal payment creation failed',
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
      // Mock for now, replace with PayPal API call
      const simulatedStatus = 'COMPLETED';
      return this.mapPayPalStatus(simulatedStatus);
    } catch (error) {
      this.logger.error(
        `Failed to get PayPal payment status for ${paymentId}`,
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
      // Mock refund, replace with PayPal refund API call
      const refundId = `REFUND-${Date.now()}`;
      return {
        success: true,
        refundId,
        amount: amount || 0,
        status: 'COMPLETED',
      };
    } catch (error) {
      this.logger.error(`PayPal refund failed for ${paymentId}`, error);
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
      // Replace with PayPal cancel API
      return true;
    } catch (error) {
      this.logger.error(`PayPal cancel failed for ${paymentId}`, error);
      return false;
    }
  }

  verifyWebhook(payload: any, signature: string): boolean {
    // Implement real webhook verification using PayPal SDK if needed
    return true;
  }

  private mapPayPalStatus(status: string): PaymentStatus {
    const map: Record<string, PaymentStatus> = {
      CREATED: PaymentStatus.PENDING,
      APPROVED: PaymentStatus.PROCESSING,
      COMPLETED: PaymentStatus.COMPLETED,
      CANCELLED: PaymentStatus.CANCELLED,
      FAILED: PaymentStatus.FAILED,
    };

    return map[status] || PaymentStatus.FAILED;
  }
}
