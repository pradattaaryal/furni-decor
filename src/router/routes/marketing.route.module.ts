import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
 import { ProductsModule } from 'src/modules/products/products.module';
import { CategoryModule } from 'src/modules/category/category.module';

@Module({
  imports: [AuthenticationModule, OtpModule, ProductsModule, CategoryModule],
 })
export class MarketingRouterModule {}
