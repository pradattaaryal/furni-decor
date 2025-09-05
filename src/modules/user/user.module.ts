import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { UserRepositoryModule } from "./repositories/user.repostory.module";
import { OtpModule } from "../otp/otp.module";

@Module({
  imports: [UserRepositoryModule, OtpModule,],
  providers: [UserService],
  exports: [
    UserService, 
    UserRepositoryModule,  
  ],
})
export class UserModule {}
