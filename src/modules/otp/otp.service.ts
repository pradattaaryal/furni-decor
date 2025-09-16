import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager, MoreThan } from 'typeorm';
import { OtpRepository } from './repositories/otp.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { OtpEntity } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepo: OtpRepository,
    private readonly userRepo: UserRepository,
  ) {}

  /**
   * Generate a numeric OTP of given length
   */
  private generateOtp(length = 6): string {
    if (length <= 0) {
      throw new BadRequestException('OTP length must be greater than 0');
    }

    const digits = '0123456789';
    return Array.from(
      { length },
      () => digits[Math.floor(Math.random() * digits.length)],
    ).join('');
  }

  /**
   * Creates a new OTP for a user. Any existing OTPs are dropped before creation.
   */
  async createOtpForUser(
    userId: number,
    manager?: EntityManager,
  ): Promise<OtpEntity> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.userRepo._findOne({
      options: { where: { id: userId } },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Drop old OTPs to avoid clutter
    await this.dropOtp(userId);

    const otp = this.generateOtp(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const newOtp = await this.otpRepo._create({
      UserEntity_id: userId,
      otp,
      expires_at: expiresAt,
    });

    return newOtp;
  }

  /**
   * Verifies if the provided OTP is valid for a user.
   * If valid, deletes the OTP to prevent reuse.
   */
  async verifyOtpForUser(userId: number, otp: string): Promise<boolean> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    if (!otp || otp.trim().length === 0) {
      throw new BadRequestException('OTP must be provided');
    }

    const otpDoc = await this.otpRepo._findOne({
      options: {
        where: {
          UserEntity_id: userId,
          otp,
          expires_at: MoreThan(new Date()),
        },
      },
    });

    if (!otpDoc) {
      return false;
    }

    await this.otpRepo._delete(otpDoc); // Prevent reuse
    return true;
  }

  /**
   * Fetch the latest valid OTP for a user (if any).
   */
  async getLatestValidOtpForUser(userId: number): Promise<OtpEntity | null> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    return this.otpRepo._findOne({
      options: {
        where: {
          UserEntity_id: userId,
          expires_at: MoreThan(new Date()),
        },
        order: { createdAt: 'DESC' as any },
      },
    });
  }

  /**
   * Deletes all OTPs for a given user (housekeeping).
   */
  async dropOtp(userId: number): Promise<void> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    await this.otpRepo._deleteRaw({ where: { UserEntity_id: userId } });
  }
}
