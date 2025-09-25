// import { BadRequestException,Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Stripe from 'stripe';
// import { AbstractPaymentService } from '../../abstract/payment.abstract.service';
// import { IStripeCheckoutSession } from '../../interfaces/payment.interface';
// import { PaymentDomainService } from '../../services/payment-domain.service';

// @Injectable()
// export class StripeService extends AbstractPaymentService {
//   private stripe: Stripe;
//   private readonly endpointSecret: string;

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly paymentDomainService: PaymentDomainService,
//   ) {
//     super();

//     const secretKey = this.configService.get<string>('stripe.secretKey', '');
//     if (!secretKey) {
//       throw new BadRequestException('Stripe Secret Key is required.');
//     }
//     this.stripe = new Stripe(secretKey);
//     this.endpointSecret = this.configService.get<string>('stripe.webHookSecretKey', '');
//     if (!this.endpointSecret) throw new BadRequestException('Stripe Webhook Secret is required.');
//   }
 
//   async createCheckoutSession(
//     amount: number,
//     currency: string,
//     metadata: Record<string, string>,
//   ): Promise<IStripeCheckoutSession> {
//     const session = await this.stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: currency.toLowerCase(),
//             product_data: { name: 'Event Tickets', metadata },
//             unit_amount: amount,  
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url:
//         this.configService.get<string>('stripe.successUrl') || 'http://localhost:3001/backend/public-user-docs',
//       cancel_url:
//         this.configService.get<string>('stripe.cancelUrl') || 'https://yourdomain.com/cancel',
//       metadata,
//     });

//     return {
//       id: session.id,
//       url: session.url!,
//       payment_status: session.payment_status!,
//     };
//   }

//   /**
//    * Retrieve an existing Stripe Checkout Session
//    */
//   async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
//     return await this.stripe.checkout.sessions.retrieve(sessionId);
//   }

//   constructEvent(rawBody: Buffer, sig: string): Stripe.Event {
//     try {
//       return this.stripe.webhooks.constructEvent(rawBody, sig, this.endpointSecret);
//     } catch (err) {
//       throw new Error(`Stripe webhook error: ${err.message}`);
//     }
//   }

//   async payment(options: { amount: number; currency: string; metadata: Record<string, string> }) {
//     const { amount, currency, metadata } = options;
//     return await this.createCheckoutSession(amount, currency, metadata);
//   }

//   async cancelPayment() {
//     return 'cancel';
//   }

//   async handleEvent(event: Stripe.Event): Promise<void> {
//     switch (event.type) {
//       case 'checkout.session.completed': {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const orderId = session.metadata?.orderId;
//         const paymentIdStr = session.metadata?.paymentId;
//         if (!orderId || !paymentIdStr) {
//           console.warn('⚠️ Missing metadata: orderId or paymentId');
//           return;
//         }

//         const paymentId = parseInt(paymentIdStr);
//         const transactionIdLocal = session.payment_intent?.toString() ?? session.id;

//         await this.paymentDomainService.completePaymentAndLink(paymentId, transactionIdLocal);
//         return;
//       }

//       case 'payment_intent.succeeded': {
//         const intent = event.data.object as Stripe.PaymentIntent;
//         const paymentIdStr = (intent.metadata as Record<string, string> | null)?.paymentId;
//         if (!paymentIdStr) {
         
//           return;
//         }
//         const paymentId = parseInt(paymentIdStr);
//         await this.paymentDomainService.completePaymentAndLink(paymentId, intent.id);
//         return;
//       }

//       default:
//         // handle different case secenerio according to enent type
//       return;
//     }
//   }

 
// }
