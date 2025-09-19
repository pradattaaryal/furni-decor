import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { CartItemRepositoryModule } from './repositories/cart-item.repository.module';
import { CartItemService } from './services/cart-item.service';
import { CartItemEntity } from './entities/cart-item.entity';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    CartItemRepositoryModule,
    TypeOrmModule.forFeature([CartItemEntity]),
    ProductVariantsModule,
    CartModule,
    ProductsModule,
  ],
  providers: [CartItemService],
  exports: [CartItemService],
  controllers: [],
})
export class CartItemModule {}
