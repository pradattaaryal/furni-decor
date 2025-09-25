// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
 
// import { PayPalService } from './services/paypal.service';
// import { PayPalWebHookController } from './controllers/paypal.web-hook.controller';
// import paypalConfig from 'src/common/configs/paypal.config';
// import { PaymentDomainModule } from '../services/payment-domain.module';

// @Module({
//   imports: [
//     ConfigModule.forFeature(paypalConfig), // 🔐 scoped config access for PayPal
//     PaymentDomainModule,
//   ],
//   controllers: [PayPalWebHookController],
//   providers: [PayPalService],
//   exports: [PayPalService], // ✅ export if used in other modules
// })
// export class PayPalModule {}
