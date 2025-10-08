import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { OrderRepositoryModule } from './repositories/order.repository.module';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './services/order.service';
import { ShippingAddressModule } from '../shipping-address/shipping-address.module';
import { CartModule } from '../cart/cart.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { CartItemModule } from '../cart-item/cart-item.module';
@Module({
  imports: [
    OrderRepositoryModule,
    forwardRef(() => OrderItemModule),
    ShippingAddressModule,
    CartModule,
    CartItemModule,
    TypeOrmModule.forFeature([OrderEntity]),
    forwardRef(() => UserModule),
  ],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [],
})
export class OrderModule {}
