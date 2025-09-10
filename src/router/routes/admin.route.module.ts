import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { AuthAdminController } from 'src/modules/authentication/controllers/auth.admin.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryAdminController } from 'src/modules/category/controllers/category.admin.controller';
 
@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    OtpModule, 
    CategoryModule
  ],
  controllers: [UserController,AuthAdminController,CategoryAdminController],
})
export class AdminRouterModule {}
