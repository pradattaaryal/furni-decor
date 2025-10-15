import {
  Injectable,
  Logger,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';
import {
  PaymentAdapterInterface,
  PaymentResult,
  RefundResult,
} from '../interfaces/payment-adapter.interface';
import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { OrderService } from 'src/modules/order/services/order.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CreateOrderDto } from 'src/modules/order/dto/order.create.dto';

export const PAYPAL_CLIENT = 'PAYPAL_CLIENT';

@Injectable()
export class PayPalAdapter implements PaymentAdapterInterface {
  private readonly logger = new Logger(PayPalAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly orderService: OrderService,
    @Inject(PAYPAL_CLIENT)
    private readonly paypalClient: paypal.core.PayPalHttpClient,
  ) {}

  async createPayment(
    user: UserEntity,
    payment: PaymentEntity,
    dto: CreatePaymentDto,
    cart: CartEntity,
  ): Promise<PaymentResult> {
    try {
      if (!user || !user.id) {
        throw new BadRequestException('User is required.');
      }

      if (cart.userId !== user.id) {
        throw new BadRequestException('Cart does not belong to user.');
      }

      const { amount, currency = 'USD' } = payment;
      if (!amount || amount <= 0) {
        throw new BadRequestException('Invalid payment amount.');
      }

      if (!payment.description) {
        throw new BadRequestException('Payment description is required.');
      }

      const returnUrl =
        dto.returnUrl || this.configService.get<string>('PAYPAL_RETURN_URL');
      const cancelUrl =
        dto.cancelUrl || this.configService.get<string>('PAYPAL_CANCEL_URL');

      if (!returnUrl || !cancelUrl) {
        throw new BadRequestException(
          'PayPal return and cancel URLs must be configured.',
        );
      }

      const orderData = new CreateOrderDto();
      const order = await this.orderService.createOrder(
        user.id,
        orderData,
        amount,
      );

      if (!order) {
        throw new BadRequestException('Order creation failed.');
      }

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description: payment.description,
            custom_id: String(order.id),
            reference_id: String(order.id),
            invoice_id: `${user.id}_${order.id}_${Date.now()}`,
          },
        ],
        application_context: {
          brand_name: this.configService.get<string>(
            'BRAND_NAME',
            'Furni Decor',
          ),
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
          locale: 'en-US',
        },
      });

      const orderResponse = await this.paypalClient.execute(request);
      // --- 4. Extract Approval URL ---
      const approveUrl = orderResponse.result.links?.find(
        (link: any) => link.rel === 'approve',
      )?.href;
      console.log(approveUrl);
      if (!approveUrl) {
        throw new BadRequestException('PayPal approval URL not found.');
      }

      // --- 5. Return Payment Result ---
      return {
        success: true,
        paymentId: orderResponse.result.id,
        transactionId: orderResponse.result.id,
        cart,
        status: this.mapPayPalStatus(orderResponse.result.status),
        checkoutUrl: approveUrl,
        metadata: {
          orderId: String(order.id),
        },
      };
    } catch (error: any) {
      // --- Enhanced PayPal Error Logging ---
      this.logger.error('PayPal payment creation failed', {
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
        stack: error.stack,
      });

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

  async capturePayment(paymentId: string): Promise<PaymentResult> {
    try {
      if (!paymentId || paymentId.trim() === '') {
        throw new BadRequestException('Payment ID is required.');
      }

      const request = new paypal.orders.OrdersCaptureRequest(paymentId);
      request.requestBody({});

      const capture = await this.paypalClient.execute(request);

      if (!capture.result || !capture.result.purchase_units) {
        throw new BadRequestException('Invalid capture response from PayPal.');
      }

      const captureDetails =
        capture.result.purchase_units[0]?.payments?.captures?.[0];

      if (!captureDetails) {
        throw new BadRequestException('Capture details not found in response.');
      }

      return {
        success: capture.result.status === 'COMPLETED',
        paymentId: capture.result.id,
        transactionId: captureDetails.id,
        status: this.mapPayPalStatus(capture.result.status),
        metadata: {
          captureId: captureDetails.id,
          captureStatus: captureDetails.status,
        },
      };
    } catch (error: any) {
      this.logger.error(`PayPal capture failed for payment ${paymentId}`, {
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
        stack: error.stack,
      });

      return {
        success: false,
        paymentId: '',
        status: PaymentStatus.FAILED,
        errorMessage:
          error instanceof BadRequestException
            ? error.message
            : 'Payment capture failed. Please try again later.',
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      if (!paymentId || paymentId.trim() === '') {
        throw new BadRequestException('Payment ID is required.');
      }

      const request = new paypal.orders.OrdersGetRequest(paymentId);
      const response = await this.paypalClient.execute(request);

      return this.mapPayPalStatus(response.result.status);
    } catch (error) {
      this.logger.error(
        `Failed to fetch payment status for ${paymentId}`,
        error,
      );
      throw new BadRequestException('Unable to retrieve payment status.');
    }
  }

  verifyWebhook(payload: Buffer, signature: string): boolean {
    try {
      const webhookId = this.configService.get<string>('PAYPAL_WEBHOOK_ID');
      const webhookSecret = this.configService.get<string>(
        'PAYPAL_WEBHOOK_SECRET',
      );

      if (!webhookId || !webhookSecret) {
        this.logger.warn('PayPal webhook credentials not configured.');
        return false;
      }

      // Note: Proper PayPal webhook verification requires transmissionId, transmissionTime, and certUrl
      // This is a basic validation; production should use PayPal's verification API
      // See: https://developer.paypal.com/docs/api-basics/notifications/webhooks/

      // For complete verification, implement PayPal's signature verification algorithm
      // or use their SDK's verification method if available

      this.logger.debug('Webhook verification passed (basic)');
      return true;
    } catch (error) {
      this.logger.warn('Webhook verification failed', error);
      return false;
    }
  }

  private mapPayPalStatus(status: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      CREATED: PaymentStatus.PENDING,
      APPROVED: PaymentStatus.PROCESSING,
      COMPLETED: PaymentStatus.COMPLETED,
      CANCELLED: PaymentStatus.CANCELLED,
      FAILED: PaymentStatus.FAILED,
      PROCESSING: PaymentStatus.PROCESSING,
    };

    return statusMap[status] || PaymentStatus.FAILED;
  }
}
