import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OtpService } from 'src/modules/otp/otp.service';
import { UserRole } from 'src/modules/user/constant/user-type.constant';
import { UserCreateDto } from 'src/modules/user/dto/user.create.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { UserService } from 'src/modules/user/services/user.service';
import { DataSource } from 'typeorm';

export type AccessTokenPayload = { sub: number; roles: UserRole };

@Injectable()
export class AuthenticationService {
  constructor(
    private _connection: DataSource,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async register(
    registerDto: UserCreateDto,
  ): Promise<{ user: UserEntity; otp: string; otpExpiresAt: Date }> {
    try {
      const hashedPassword = bcrypt.hashSync(registerDto.password, 10);

      const user = await this.userService.create({
        ...registerDto,
        password: hashedPassword,
      });

      const newOtp = await this.otpService.createOtpForUser(user.id);

      return { user, otp: newOtp.otp, otpExpiresAt: newOtp.expires_at };
    } catch (error) {
      throw error;
    } finally {
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository._findOne({
      options: { where: { email }, withDeleted: false } as any,
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, (user as any).password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.verified) throw new UnauthorizedException('Account not verified');

    const { password: _password, ...rest } = user as any;
    return rest;
  }

  async generateAccessToken(user: { id: number; role: UserRole }) {
    const payload: AccessTokenPayload = { sub: user.id, roles: user.role };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepository._findOne({
      options: { where: { email } },
    });
    if (!user) throw new BadRequestException('User not found');

    const ok = await this.otpService.verifyOtpForUser(user.id, otp);
    if (!ok) throw new UnauthorizedException('Invalid or expired OTP');

    user.verified = true;
    await this.userRepository._update(user);

    return this.generateAccessToken({
      id: user.id,
      role: user.role as UserRole,
    });
  }
}
