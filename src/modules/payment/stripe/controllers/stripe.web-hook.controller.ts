// import {
//   BadRequestException,
//   Controller,
//   Post,
//   Req,
//   Res,
//   SerializeOptions,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
// import { StripeService } from '../services/stripe.service';
// import Stripe from 'stripe';

// interface RawBodyRequest<T = any> extends Request {
//   rawBody: Buffer;
// }

// // Define the metadata interface
// interface PaymentMetadata {
//   paymentId?: string;
//   userId?: string;
//   orderId?: string;
//   [key: string]: string | undefined; // allow other string keys with string or undefined values
// }

// @SerializeOptions({
//   groups: ALL_GROUP,
// })
// @Controller('webhook')
// export class StripeWebHookController {
//   constructor(private readonly _stripeService: StripeService) {}

//   @Post()
//   async webhook(@Req() req: RawBodyRequest, @Res() res: Response) {
//     const sig = req.headers['stripe-signature'];

//     try {
//       const event = this._stripeService.constructEvent(req.rawBody, sig as string);

//       if (event.type === 'checkout.session.completed') {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const metadata = session.metadata as PaymentMetadata;
//         const rawTransactionId = session.payment_intent;
//         let transactionId: string | null = null;

//         if (typeof rawTransactionId === 'string') {
//           transactionId = rawTransactionId;
//         } else if (rawTransactionId && typeof rawTransactionId === 'object') {
//           transactionId = rawTransactionId.id;
//         }
//         if (!transactionId) {
//           throw new BadRequestException('PaymentIntent ID is missing from session');
//         }
//       }

//       await this._stripeService.handleEvent(event);
//       return res.status(200).send();
//     } catch (err) {
//       console.error('⚠️  Webhook signature verification failed:', err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//   }
// }
