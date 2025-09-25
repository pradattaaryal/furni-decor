// import {
//   DynamicModule,
//   forwardRef,
//   ForwardReference,
//   Provider,
//   Type,
// } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { IPaymentOptions } from './interfaces/payment.interface';
// import { PaymentService } from './services/payment.service';
//  import { PaymentRepository } from './repositories/payment.repository';
// import { PaymentEntity } from './entities/payment.entity';
// import { OrderEntity } from 'src/modules/order/entities/order.entity';
// import { PublicUserEntity } from 'src/modules/public-users/entities/public-user.entity';
  
// import { StripeService } from './stripe/services/stripe.service';
// import { StripeModule } from './stripe/stripe.module';
// import { PayPalService } from './paypal/services/paypal.service';
// import { PayPalModule } from './paypal/paypal.module';
 
// import { PAYMENT_PAYPAL_PROVIDER, PAYMENT_STRIPE_PROVIDER } from './constants/payment.constant';
// import { AuthenticationModule } from '../authentication/authentication.module';
// import { OrderRepository } from '../order/repositories/order/order.repository';
// import { PaymentDomainModule } from './services/payment-domain.module';
  

// export class PaymentModule {
//   static forRoot(options: IPaymentOptions): DynamicModule {
//     const imports: (
//       | DynamicModule
//       | Type<any>
//       | Promise<DynamicModule>
//       | ForwardReference<any>
//     )[] = [];
//     const providers: Provider<any>[] = [];
 
//     if (options.stripe) {
//       imports.push( StripeModule);
//       // Do not push StripeService directly; rely on StripeModule provider
//     }
 
//     if (options.paypal) {
//       imports.push(PayPalModule);
//       // Do not push PayPalService directly; rely on PayPalModule provider
//     }
//     if (options.stripe) {
//       providers.push({
//         provide: PAYMENT_STRIPE_PROVIDER,
//         useExisting: StripeService,
//       });
//     }  

//     if (options.paypal) {
//       providers.push({
//         provide: PAYMENT_PAYPAL_PROVIDER,
//         useExisting: PayPalService,
//       });
//     }

//     return {
//       module: PaymentModule,
//       imports: [
//         ...imports,
//         TypeOrmModule.forFeature([PaymentEntity, OrderEntity, PublicUserEntity]),
//         AuthenticationModule,
//         PaymentDomainModule,
//       ],
    
//       providers: [
//         ...providers,
//         PaymentService,
//          PaymentRepository,
//          OrderRepository,
//       ],
//       exports: [...providers, PaymentService,  PaymentRepository,OrderRepository, PaymentDomainModule],
//     };
//   }
// }


