import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserCreateDto } from '../dto/user.create.dto';
import { MarketingUserCreateDto } from '../dto/marketing.create.dto';
import { UserRepository } from '../repositories/user.repository';
import { OtpService } from 'src/modules/otp/otp.service';
import { Not } from 'typeorm';
import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';
import { IFindOneOptions } from 'src/common/database/interfaces/findOption.interface';
import * as bcrypt from 'bcryptjs';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: OtpService,
  ) {}
  async create(
    createDto: UserCreateDto,
    options?: ICreateOptions,
  ): Promise<UserEntity> {
    // Validate required fields upfront
    if (!createDto.email || !createDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    // Check if the user already exists by email
    await this.throwErrorIfExistingUserByEmailFound(
      createDto.email,
      null,
      options,
    );

    // Delegate actual creation to repository (business logic is minimal here)
    const user = await this.userRepo._create(createDto, {
      entityManager: options?.entityManager,
    });

    return user;
  }

  /**
   * Register a regular user with hashed password and OTP generation
   */
  async register(
    registerDto: UserCreateDto,
  ): Promise<{ user: UserEntity; otp: string; otpExpiresAt: Date }> {
    // Validate password
    if (!registerDto.password || registerDto.password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    // Prevent duplicate email
    await this.throwErrorIfExistingUserByEmailFound(registerDto.email);

    // Hash password
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);

    // Apply defaults for optional fields if not provided
    const userToCreate: Partial<UserEntity> = {
      ...registerDto,
      password: hashedPassword,
    };

    // Persist user
    const user = await this.userRepo._create(userToCreate);

    // Generate OTP
    const newOtp = await this.otpService.createOtpForUser(user.id);

    return {
      user,
      otp: newOtp.otp,
      otpExpiresAt: newOtp.expires_at,
    };
  }

  /**
   * Register an employee (Marketing) user
   */
  async registerEmployee(
    registerDto: MarketingUserCreateDto,
  ): Promise<{ user: UserEntity }> {
          if (!registerDto.password || registerDto.password.length < 6) {
            throw new BadRequestException(
              'Password must be at least 6 characters long',
            );
          }

    // Prevent duplicate email
    await this.throwErrorIfExistingUserByEmailFound(registerDto.email);

    // Hash password
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);

    // Apply defaults
    const userToCreate: Partial<UserEntity> = {
      ...registerDto,
      password: hashedPassword,
      role:  'marketing',
      verified:  true,
    };

    // Persist user
    const user = await this.userRepo._create(userToCreate);

    return { user };
  }

  /**
   * Prevent duplicate emails
   */
  private async throwErrorIfExistingUserByEmailFound(
    email: string,
    excludeUser?: UserEntity | null,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<void> {
    if (!email) {
      throw new BadRequestException('Email must be provided');
    }

    const where: Record<string, any> = { email };
    if (excludeUser) {
      where['id'] = Not(excludeUser.id);
    }

    const existingUser = await this.userRepo._findOne({
      options: { where },
      withDeleted: true,
      entityManager: options?.entityManager,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }
  }

  /**
   * Fetch user by ID
   */
  async getById(
    id: number,
    options?: IFindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userRepo._findOneById(id, options);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
