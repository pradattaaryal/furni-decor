// import { Injectable, BadRequestException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { AbstractPaymentService } from '../../abstract/payment.abstract.service';
// import { IPaymentCreateDto, IStripeCheckoutSession } from '../../interfaces/payment.interface';
// import { PaymentDomainService } from '../../services/payment-domain.service';

// // ✅ Define a strongly-typed interface for the PayPal config
// interface PayPalConfig {
//   clientId: string;
//   clientSecret: string;
//   apiBase: string;
// }

// @Injectable()
// export class PayPalService extends AbstractPaymentService {
//   private readonly clientId: string;
//   private readonly clientSecret: string;
//   private readonly apiBase: string;

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly paymentDomainService: PaymentDomainService,
//   ) {
//     super();

//     // ✅ Access config using registerAs namespace and cast to PayPalConfig
//     const config = this.configService.get<PayPalConfig>('paypal');

//     if (!config?.clientId || !config?.clientSecret) {
//       throw new BadRequestException('PayPal credentials are required.');
//     }

//     this.clientId = config.clientId;
//     this.clientSecret = config.clientSecret;
//     this.apiBase = config.apiBase;
//   }

//   async payment(options: { amount: number; currency: string; metadata: Record<string, string> }) {
//     // 🧪 Mock PayPal order creation logic (replace with real API integration)
//     return {
//       id: 'paypal_order_id',
//       url: `https://www.sandbox.paypal.com/checkoutnow?token=paypal_order_id`,
//       payment_status: 'PENDING',
//     };
//   }

//   async cancelPayment() {
//     return 'cancel';
//   }

//   async handleWebhookEvent(eventBody: any) {
//     // ✅ PayPal webhook event handler placeholder
//     return true;
//   }

//   // Example usage of domain service (to be called when PayPal capture succeeds)
//   async confirmPayment(paymentId: number, providerTransactionId: string) {
//     return this.paymentDomainService.completePaymentAndLink(paymentId, providerTransactionId);
//   }

//   async Update_transactionId(transactionId: string,orderId:string) {
    
//   }
//   async status_update(id: string) {
    
//   }
// }
