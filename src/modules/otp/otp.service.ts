import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager, MoreThan } from 'typeorm';
import { OtpRepository } from './repositories/otp.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { OtpEntity } from './entities/otp.entity';
 
@Injectable()
export class OtpService {
  constructor(
    private readonly _otpRepo: OtpRepository,
    private readonly _userRepo: UserRepository,
   ) {}

  generateOtp(length = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  async createOtpForUser(userId: number,manager?: EntityManager) {
    
    const user = await this._userRepo._findOne({
      options: { where: { id: userId } },
    });
  if (!user) {
  throw new NotFoundException('User does not exist');
}

      await this.dropOtp(userId);

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const newOtp = await this._otpRepo._create({
      UserEntity_id: userId,
      otp,
      expires_at: expiresAt,
    });

    return newOtp;
  }

  async verifyOtpForUser(userId: number, otp: string): Promise<boolean> {
    const otpDoc = await this._otpRepo._findOne({
      options: {
        where: {
          UserEntity_id: userId,
          otp,
          expires_at: MoreThan(new Date()),
        },
      },
    });

    if (!otpDoc) return false;

    await this._otpRepo._delete(otpDoc);
    return true;
  }

  async getLatestValidOtpForUser(userId: number): Promise<OtpEntity | null> {
    const data = await this._otpRepo._findOne({
      options: {
        where: {
          UserEntity_id: userId,
          expires_at: MoreThan(new Date()),
        },
        order: { createdAt: 'DESC' as any },
      },
    });
    return data;
  }

  async dropOtp(userId: number): Promise<void> {
    await this._otpRepo._deleteRaw({ where: { UserEntity_id: userId } });
  }
}
