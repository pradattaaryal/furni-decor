import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager, MoreThan, Repository } from 'typeorm';
import { OtpRepository } from '../repositories/otp.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { OtpEntity } from '../entities/otp.entity';
import { CartService } from 'src/modules/cart/services/cart.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from 'src/modules/image/entities/image.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>,

    private readonly otpRepo: OtpRepository,
    private readonly _userRepo: UserRepository,
    private readonly _cartService: CartService,
  ) {}

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

  async createOtpForUser(
    userId: number,
    manager?: EntityManager,
  ): Promise<OtpEntity> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this._userRepo._findOne({
      entityManager: manager,
      options: {
        where: {
          id: userId,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Drop old OTPs to avoid clutter
    //await this.dropOtp(userId, manager);

    const otp = this.generateOtp(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const newOtp = await this.otpRepo._create(
      {
        UserEntity_id: userId,
        otp,
        expires_at: expiresAt,
      },
      { entityManager: manager },
    );

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
      throw new BadRequestException('OTP for user not found');
    }

    await this.otpRepo._delete(otpDoc);

    ///create cart for user//

    const cart = await this._cartService.create({ userId });
    const user = await this._userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.cart = cart;
    await this._userRepository.save(user);
    /////////////////////////
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
  async dropOtp(userId: number, manager?: EntityManager): Promise<void> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }
    const otpToDelete = await this.otpRepo._findOne({
      entityManager: manager,
      options: {
        where: {
          UserEntity_id: userId,
        },
      },
    });

    if (otpToDelete) {
      await this.otpRepo._softDelete(otpToDelete, { entityManager: manager });
    } else {
      throw new NotFoundException('OTP not found');
    }
  }
}
