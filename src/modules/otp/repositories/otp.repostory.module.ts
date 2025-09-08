import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../entities/otp.entity';
import { OtpRepository } from './otp.repository';
  
@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  providers: [OtpRepository],
  exports: [OtpRepository],
})
export class OtpRepositoryModule {}
