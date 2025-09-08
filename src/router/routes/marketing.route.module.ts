import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { AuthMarketingController } from 'src/modules/authentication/controllers/auth.marketing.controller';
 
@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    OtpModule, 
  ],
  controllers: [UserController,AuthMarketingController],
})
export class MarketingRouterModule {}
