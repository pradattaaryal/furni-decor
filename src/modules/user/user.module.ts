import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { UserRepositoryModule } from "./repositories/user.repostory.module";

@Module({
  imports: [UserRepositoryModule],
  providers: [UserService],
  exports: [
    UserService, 
    UserRepositoryModule, // ✅ re-export the repository module
  ],
})
export class UserModule {}
