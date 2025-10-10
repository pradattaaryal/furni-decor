import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryModule } from '../user/repositories/user.repostory.module';
import { CartModule } from '../cart/cart.module';
import { PaymentEntity } from './entities/payment.entity';
import { PayPalAdapter } from './adapter/paypal.adapter';
import { StripeAdapter } from './adapter/stripe.adapter';
import { PaymentService } from './services/payment.service';
import { WebhookService } from './services/webhook.service';
import { PaymentAdapterFactory } from './factories/payment-adapter.factory';
import { PaymentRepository } from './repositories/payment.repository';
import { OrderModule } from '../order/order.module';
import { ProductsModule } from '../products/products.module';
import { ProductRepositoryModule } from '../products/repositories/product.repository.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    OrderModule,
    CartModule,
    ProductsModule,
    ProductRepositoryModule,
    UserModule,
  ],
  providers: [
    PaymentService,
    WebhookService,
    PaymentRepository,
    StripeAdapter,
    PayPalAdapter,
    PaymentAdapterFactory,
  ],
  exports: [PaymentService, PaymentRepository, WebhookService],
})
export class PaymentModule {}
