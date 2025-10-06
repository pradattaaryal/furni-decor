import { Injectable } from '@nestjs/common';
import { StripeProvider } from '../provider/stripe.provider';
import { PaymentProvider } from '../interfaces/payment.interface';
import { PaymentProviderEnum } from '../constant/payment.constant';

@Injectable()
export class PaymentFactoryService {
  constructor(
    private stripeProvider: StripeProvider,
    // private paypalProvider: PayPalProvider,
  ) {}

  getProvider(providerType: PaymentProviderEnum): PaymentProvider {
    switch (providerType) {
      case PaymentProviderEnum.STRIPE:
        return this.stripeProvider;
      //   case PaymentProvider.PAYPAL:
      //     return this.paypalProvider;
      default:
        throw new Error(`Unsupported payment provider: ${providerType}`);
    }
  }
}
