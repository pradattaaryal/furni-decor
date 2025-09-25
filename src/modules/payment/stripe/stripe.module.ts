// import {Module } from '@nestjs/common';
// import { StripeService } from './services/stripe.service';
// import { StripeWebHookController } from './controllers/stripe.web-hook.controller';
// import { PaymentRepositoryModule } from '../repositories/payment.repository.module';
// import { OrderRepositoryModule } from 'src/modules/order/repositories/order/order.repository.module';
// import { PaymentDomainModule } from '../services/payment-domain.module';

// @Module({
//   imports: [PaymentRepositoryModule, OrderRepositoryModule, PaymentDomainModule],
//   providers: [StripeService],
//   exports: [StripeService],
//   controllers: [StripeWebHookController],
// })
// export class StripeModule {}
