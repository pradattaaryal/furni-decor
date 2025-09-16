import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
// import { MailModule } from '@/mail/mail.module';
import { OtpRepository } from './repositories/otp.repository';
import { OtpEntity } from './entities/otp.entity';
import { UserRepositoryModule } from '../user/repositories/user.repostory.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity]), UserRepositoryModule],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
/*MailModule*/
