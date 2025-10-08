import { Injectable } from '@nestjs/common';
import { PaymentProvider } from '../entities/payment.entity';
import { PaymentAdapterInterface } from '../interfaces/payment-adapter.interface';
import { StripeAdapter } from '../adapter/stripe.adapter';
import { PayPalAdapter } from '../adapter/paypal.adapter';

@Injectable()
export class PaymentAdapterFactory {
  constructor(
    private stripeAdapter: StripeAdapter,
    private paypalAdapter: PayPalAdapter,
  ) {}

  getAdapter(provider: PaymentProvider): PaymentAdapterInterface {
    switch (provider) {
      case PaymentProvider.STRIPE:
        return this.stripeAdapter;
      case PaymentProvider.PAYPAL:
        return this.paypalAdapter;
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}
