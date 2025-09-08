import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpEntity } from '../entities/otp.entity';
 
@Injectable()
export class OtpRepository extends BaseRepository<OtpEntity> {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly _otpRepo: Repository<OtpEntity>,
  ) {
    super(_otpRepo);
  }
}
