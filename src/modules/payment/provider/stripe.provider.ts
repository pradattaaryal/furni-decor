import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  PaymentConfirmationResponse,
  PaymentIntentResponse,
  PaymentProvider,
} from '../interfaces/payment.interface';

@Injectable()
export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const clientSecret = this.configService.get<string>('stripe.clientSecret');
    if (!clientSecret)
      throw new Error('Stripe clientSecret is not set in env/config');
    this.stripe = new Stripe(clientSecret, {
      apiVersion: (this.configService.get<string>('stripe.apiVersion') ||
        '2023-10-16') as '2025-08-27.basil',
    });
  }

  async createPaymentIntent(
    payment: any,
    options?: any,
  ): Promise<PaymentIntentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(payment.amount * 100),
        currency: payment.currency.toLowerCase(),
        metadata: {
          paymentId: payment.id,
          userId: payment.userId,
          orderId: payment.orderId,
          ...payment.metadata,
        },
        description: payment.description,
        ...options,
      });

      return {
        clientSecret: paymentIntent.client_secret ?? undefined,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      throw new Error(
        `Stripe payment intent creation failed: ${error.message}`,
      );
    }
  }

  async confirmPayment(
    paymentIntentId: string,
    options?: any,
  ): Promise<PaymentConfirmationResponse> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      let confirmedIntent = paymentIntent;
      if (paymentIntent.status === 'requires_confirmation') {
        confirmedIntent = await this.stripe.paymentIntents.confirm(
          paymentIntentId,
          options,
        );
      }

      return {
        success: confirmedIntent.status === 'succeeded',
        transactionId: confirmedIntent.id,
        status: confirmedIntent.status,
        metadata: confirmedIntent.metadata,
      };
    } catch (error) {
      throw new Error(`Stripe payment confirmation failed: ${error.message}`);
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<any> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
      };
    } catch (error) {
      throw new Error(`Stripe refund failed: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status;
    } catch (error) {
      throw new Error(`Failed to get Stripe payment status: ${error.message}`);
    }
  }
}
