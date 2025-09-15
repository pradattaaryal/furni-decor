import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
 import { AuthMarketingController } from 'src/modules/authentication/controllers/auth.marketing.controller';
import { ProductMarketingController } from 'src/modules/products/controllers/product.marketing.controller';
import { ProductsModule } from 'src/modules/products/products.module';
 
@Module({
  imports: [
    AuthenticationModule,
    OtpModule, 
    ProductsModule,
  ],
  controllers: [AuthMarketingController,ProductMarketingController],
})
export class MarketingRouterModule {}
