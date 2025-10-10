import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaymentEntity,
  PaymentStatus,
  PaymentProvider,
} from '../entities/payment.entity';
import { PaymentAdapterFactory } from '../factories/payment-adapter.factory';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    private paymentAdapterFactory: PaymentAdapterFactory,
  ) {}

  async handleStripeWebhook(payload: any, signature: string): Promise<void> {
    const adapter = this.paymentAdapterFactory.getAdapter(
      PaymentProvider.STRIPE,
    );

    const event = adapter.verifyWebhook(payload, signature);
    if (!event) {
      throw new BadRequestException('Invalid webhook signature');
    }
    const paymentIntent = event.data.object;
    console.log(`Stripe payment ID: ${paymentIntent.id}`);
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log(
          `======================================payment sucess=========================================`,
        );
        await this.handlePaymentSuccess(
          paymentIntent.id,
          PaymentProvider.STRIPE,
        );
        break;

      case 'payment_intent.payment_failed':
        console.log(
          `======================================payment failed=========================================`,
        );

        // await this.handlePaymentFailure(
        //   payload.data.object.id,
        //   payload.data.object.last_payment_error?.message,
        //   PaymentProvider.STRIPE
        // );
        break;

      //   case 'payment_intent.canceled':
      //     await this.handlePaymentCancellation(
      //       payload.data.object.id,
      //       PaymentProvider.STRIPE
      //     );
      //     break;

      //   case 'charge.refunded':
      //     await this.handleRefund(
      //       payload.data.object.payment_intent,
      //       payload.data.object.amount_refunded / 100,
      //       PaymentProvider.STRIPE
      //     );
      //     break;

      default:
        this.logger.log(`event type: ${event.type}`);
    }
  }

  async handlePayPalWebhook(payload: any, signature: string): Promise<void> {
    const adapter = this.paymentAdapterFactory.getAdapter(
      PaymentProvider.PAYPAL,
    );

    if (!adapter.verifyWebhook(payload, signature)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Processing PayPal webhook: ${payload.event_type}`);

    switch (payload.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await this.handlePaymentSuccess(
          payload.resource.id,
          PaymentProvider.PAYPAL,
        );
        break;

      default:
        this.logger.log(`Unhandled PayPal event type: ${payload.event_type}`);
    }
  }

  private async handlePaymentSuccess(
    providerPaymentId: string,
    provider: PaymentProvider,
  ): Promise<void> {
    try {
      console.log(` payment success handler${providerPaymentId}`);
      console.log(` payment provider${provider}`);

      const payment = await this.paymentRepository.findOne({
        where: { providerPaymentId, provider },
      });

      if (!payment) {
        this.logger.warn(`PaymentEntity not found: ${providerPaymentId}`);
        return;
      }

      payment.status = PaymentStatus.COMPLETED;
      await this.paymentRepository.save(payment);

      this.logger.log(`PaymentEntity ${payment.id} marked as completed`);
    } catch (error) {
      this.logger.error(`Failed to handle payment success: ${error.message}`);
      throw error;
    }
  }
}
