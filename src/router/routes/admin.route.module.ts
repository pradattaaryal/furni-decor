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
import { ProductVarientAdminController } from 'src/modules/product-variants/controllers/product-variant.admin.controller';
import { ImageAdminController } from 'src/modules/image/controllers/image.admin.controller';
import { ImageModule } from 'src/modules/image/image.module';

@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    OtpModule,
    CategoryModule,
    ProductsModule,
    ProductVariantsModule,
    ImageModule,
  ],
  controllers: [
    AdminUserController,
    AuthAdminController,
    CategoryAdminController,
    ProductAdminController,
    ProductVarientAdminController,
    ImageAdminController,
  ],
})
export class AdminRouterModule {}
