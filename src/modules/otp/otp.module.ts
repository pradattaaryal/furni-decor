import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './service/otp.service';
// import { MailModule } from '@/mail/mail.module';
import { OtpRepository } from './repositories/otp.repository';
import { OtpEntity } from './entities/otp.entity';
import { UserRepositoryModule } from '../user/repositories/user.repostory.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
    UserRepositoryModule,
    forwardRef(() => CartModule),
  ],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
/*MailModule*/
