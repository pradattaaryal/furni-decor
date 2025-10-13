import { Module } from '@nestjs/common';
import { WishlistRepositoryModule } from './repositories/wishlist.repository.module';
import { WishlistService } from './services/wishlist.service';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { ProductRepositoryModule } from '../products/repositories/product.repository.module';
import { UserRepositoryModule } from '../user/repositories/user.repostory.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { ProductVariantRepositoryModule } from '../product-variants/repositories/product-variant.repository.module';

@Module({
  imports: [
    WishlistRepositoryModule,
    UserModule,
    ProductsModule,
    ProductRepositoryModule,
    UserRepositoryModule,
    ProductVariantsModule,
    ProductVariantRepositoryModule,
  ],
  providers: [WishlistService],
  exports: [WishlistService, WishlistRepositoryModule],
})
export class WishlistModule {}
