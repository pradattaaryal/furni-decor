import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import * as paypal from '@paypal/checkout-server-sdk';

export const PAYPAL_CLIENT = 'PAYPAL_CLIENT';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    ConfigModule, // 👈 required for ConfigService
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

    // 👇 add this provider for PayPal client
    {
      provide: PAYPAL_CLIENT,
      useFactory: (configService: ConfigService) => {
        const clientId = configService.get<string>('PAYPAL_CLIENT_ID');
        const clientSecret = configService.get<string>('PAYPAL_CLIENT_SECRET');
        const environment =
          configService.get<string>('NODE_ENV') === 'production'
            ? new paypal.core.LiveEnvironment(clientId, clientSecret)
            : new paypal.core.SandboxEnvironment(clientId, clientSecret);

        return new paypal.core.PayPalHttpClient(environment);
      },
      inject: [ConfigService],
    },
  ],
  exports: [PaymentService, PaymentRepository, WebhookService],
})
export class PaymentModule {}
