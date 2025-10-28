import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserCreateDto } from '../dto/user.create.dto';
import { MarketingUserCreateDto } from '../dto/marketing.create.dto';
import { UserRepository } from '../repositories/user.repository';
import { OtpService } from 'src/modules/otp/service/otp.service';
import { Not, UpdateResult } from 'typeorm';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import {
  IFindOneOptions,
  IPaginateFindOption,
} from 'src/common/database/interfaces/findOption.interface';
import * as bcrypt from 'bcryptjs';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { ImageService } from 'src/modules/image/services/image.service';
import {
  IUserCreateDto,
  IUserUpdateDto,
} from '../interfaces/user.create.dto.interface';
import { IPrepareUserCreateData } from '../interfaces/user.prepare-create.interface';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { options } from 'joi';
import { UserUpdateDto } from '../dto/user.update.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: OtpService,
    private readonly imageService: ImageService,
  ) {}
  async create(
    createDto: UserCreateDto,
    options?: ICreateOptions,
  ): Promise<UserEntity> {
    if (!createDto.email || !createDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    await this.throwErrorIfExistingUserByEmailFound(
      createDto.email,
      null,
      options,
    );

    const preparedData = await this.prepareCreateUserData(createDto);
    const user = await this.userRepo._create(preparedData, {
      entityManager: options?.entityManager,
    });

    return user;
  }
  async updateUserData(
    userData: IUserUpdateDto,
    userId: number,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<UserEntity> {
    const existingUser = await this.userRepo._findOneById(userId, {
      relations: { image: true },
      ...options,
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let image;
    if (userData.imageId) {
      image = await this.imageService.getById(userData.imageId);
      if (!image) {
        throw new NotFoundException(
          `Image with ID ${userData.imageId} not found`,
        );
      }
      existingUser.image = image;
    }

    Object.assign(existingUser, {
      firstName: userData.firstName ?? existingUser.firstName,
      lastName: userData.lastName ?? existingUser.lastName,
    });

    await this.userRepo._update(existingUser, options);

    const updatedUser = await this.userRepo._findOneById(userId, {
      relations: { image: true },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return updatedUser;
  }
  async updateStripeCustomerId(
    userId: number,
    stripeCustomerId: string,
  ): Promise<void> {
    if (!userId || !stripeCustomerId) {
      throw new BadRequestException(
        'User ID and Stripe Customer ID are required',
      );
    }

    const user = await this.userRepo._findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.stripeCustomerId = stripeCustomerId;
    await this.userRepo._update(user);
  }
  async register(
    registerDto: UserCreateDto,
    options?: ICreateOptions,
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
    const userToCreate = {
      ...registerDto,
      password: hashedPassword,
    };

    const preparedData = await this.prepareCreateUserData(userToCreate);

    // Persist user
    const user = await this.userRepo._create(preparedData, {
      entityManager: options?.entityManager,
    });

    // Generate OTP
    const newOtp = await this.otpService.createOtpForUser(
      user.id,
      options?.entityManager,
    );

    return {
      user,
      otp: newOtp.otp,
      otpExpiresAt: newOtp.expires_at,
    };
  }

  async registerEmployee(
    registerDto: MarketingUserCreateDto,
    options?: ICreateOptions,
  ): Promise<{ user: UserEntity }> {
    if (!registerDto.password || registerDto.password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    await this.throwErrorIfExistingUserByEmailFound(registerDto.email);

    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);

    const userToCreate = {
      ...registerDto,
      password: hashedPassword,
      role: 'marketing',
      verified: true,
    };

    const preparedData = await this.prepareCreateUserData(userToCreate);

    const user = await this.userRepo._create(preparedData, {
      entityManager: options?.entityManager,
    });

    return { user };
  }

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

  async softDelete(
    user: UserEntity,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<UserEntity> {
    return await this.userRepo._softDelete(user, options);
  }

  async delete(
    user: UserEntity,
    options?: IDeleteOptions<UserEntity>,
  ): Promise<UserEntity> {
    return await this.userRepo._delete(user, options);
  }

  async restore(
    options: IUpdateRawOptions<UserEntity>,
  ): Promise<UpdateResult | null> {
    return await this.userRepo._restoreRaw(options);
  }

  async paginatedUser(
    options?: IPaginateFindOption<UserEntity>,
  ): Promise<{ data: UserEntity[]; _pagination: IPaginationMeta }> {
    return this.userRepo._paginateFind({
      ...options,
      options: {
        ...(options?.options || {}),
      },
    });
  }

  async prepareCreateUserData(
    data: IUserCreateDto,
  ): Promise<IPrepareUserCreateData> {
    if (data.imageId) {
      const image = await this.imageService.getById(data.imageId);

      delete data.imageId;

      return {
        ...data,
        image,
      };
    }

    return data;
  }
}
