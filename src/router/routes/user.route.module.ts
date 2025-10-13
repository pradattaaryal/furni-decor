import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { AuthCustomerController } from 'src/modules/authentication/controllers/auth.customer.controller';
import { PublicUserController } from 'src/modules/user/controllers/user.controller';
import { ProductsModule } from 'src/modules/products/products.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { ImageModule } from 'src/modules/image/image.module';
import { ImageUserController } from 'src/modules/image/controllers/image.user.controller';

@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    OtpModule,
    ProductsModule,
    CategoryModule,
    ImageModule,
  ],
  controllers: [
    PublicUserController,
    AuthCustomerController,
    ImageUserController,
  ],
})
export class UserRouterModule {}
