import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';
import { PaymentFactoryService } from './services/payment-factory.service';
import { StripeProvider } from './provider/stripe.provider';
import { PaymentRepositoryModule } from './repositories/payment.repository.module';
// import { PaymentController } from './payment.controller';
// import { StripeProvider } from './providers/stripe.provider';
// import { PayPalProvider } from './providers/paypal.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    ConfigModule,
    PaymentRepositoryModule,
  ],
//  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentFactoryService,
    
    StripeProvider,
    // PayPalProvider,
  ],
  exports: [PaymentService, PaymentFactoryService],
})
export class PaymentModule {}