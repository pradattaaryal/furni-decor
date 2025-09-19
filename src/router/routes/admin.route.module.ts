import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { AdminUserController } from 'src/modules/user/controllers/user.admin.controller';
import { AuthAdminController } from 'src/modules/authentication/controllers/auth.admin.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryAdminController } from 'src/modules/category/controllers/category.admin.controller';
import { ProductsModule } from 'src/modules/products/products.module';
import { ProductAdminController } from 'src/modules/products/controllers/product.admin.controller';
import { ProductVariantsModule } from 'src/modules/product-variants/product-variants.module';
import { ProductVarientsAdminController } from 'src/modules/product-variants/controllers/product-variant.admin.controller';
import { ProductRatingAdminController } from 'src/modules/product-rating/controllers/product-rating.admin.controller';
import { ProductRatingModule } from 'src/modules/product-rating/product-rating.module';
import { ImageAdminController } from 'src/modules/image/controllers/image.admin.controller';
import { ImageModule } from 'src/modules/image/image.module';
import { CartAdminController } from 'src/modules/cart/controllers/cart.admin.controller';
import { CartModule } from 'src/modules/cart/cart.module';
import { CartItemModule } from 'src/modules/cart-item/cart-item.module';
import { CartItemAdminController } from 'src/modules/cart-item/controllers/cart-item.admin.controller';

@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    OtpModule,
    CategoryModule,
    ProductsModule,
    ProductVariantsModule,
    ProductRatingModule,
    ImageModule,
    CartModule,
    CartItemModule,
  ],
  controllers: [
    AdminUserController,
    AuthAdminController,
    CategoryAdminController,
    ProductAdminController,
    ProductRatingAdminController,
    ProductVarientsAdminController,
    ImageAdminController,
    CartAdminController,
    CartItemAdminController,
  ],
})
export class AdminRouterModule {}
