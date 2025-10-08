import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { OrderItemRepositoryModule } from './repositories/order-item.repository.module';
import { OrderModule } from '../order/order.module';
import { ProductsModule } from '../products/products.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { OrderItemService } from './services/order-item.service';
import { ImageModule } from '../image/image.module';

@Module({
  providers: [OrderItemService],
  exports: [OrderItemService],
  controllers: [],
  imports: [
    ImageModule,
    forwardRef(() => OrderModule),
    ProductsModule,
    ProductVariantsModule,
    OrderItemRepositoryModule,
    forwardRef(() => UserModule),
  ],
})
export class OrderItemModule {}
