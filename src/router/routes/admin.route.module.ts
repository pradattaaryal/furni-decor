import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { UserAdminController } from 'src/modules/user/controllers/user.controller';
import { AuthController } from 'src/modules/authentication/controllers/auth.Admin.controller';
 
@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    OtpModule, 
  ],
  controllers: [UserAdminController,AuthController],
})
export class AdminRouterModule {}
