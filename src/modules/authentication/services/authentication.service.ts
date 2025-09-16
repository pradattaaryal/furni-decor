import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

export type AccessTokenPayload = { sub: number; roles: UserRole };
export type TokenPayloadForCredentialReset = { sub: number; email: string };

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  /** ================= AUTH HELPERS ================== */

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }

  private async verifyUser(user: UserEntity): Promise<UserEntity> {
    if (user.verified) return user;

    user.verified = true;
    return this.userRepository._update(user);
  }

  private sanitizeUser(user: UserEntity): Omit<UserEntity, 'password'> {
  const { password, ...rest } = user as any;
  return rest;
}


  /** ================= TOKEN HANDLERS ================== */

  async generateAccessToken(user: { id: number; role: UserRole }) {
    const payload: AccessTokenPayload = { sub: user.id, roles: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async generateTokenForCredentialReset(user: { id: number; email: string }) {
    const payload: TokenPayloadForCredentialReset = {
      sub: user.id,
      email: user.email,
    };
    return { resetToken: this.jwtService.sign(payload, { expiresIn: '15m' }) };
  }

  async decodeConfirmationToken(
    token: string,
  ): Promise<{ userId: number; email: string }> {
    try {
      const payload =
        await this.jwtService.verifyAsync<TokenPayloadForCredentialReset>(
          token,
        );
      return { userId: payload.sub, email: payload.email };
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  /** ================= USER VALIDATION ================== */

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.findUserByEmail(email);
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UnauthorizedException('Email not found');
    }
    if (!user.verified) {
      throw new UnauthorizedException('Account not verified');
    }
    return this.sanitizeUser(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository._findOne({
      options: { where: { email }, withDeleted: false } as any,
    });
  }

  /** ================= LOGIN FLOWS ================== */

  async login(data: { email: string; password: string }) {
    const user = await this.validateUser(data.email, data.password);

    const token = await this.generateAccessToken({
      id: user.id,
      role: user.role as UserRole,
    });

    return { token, user };
  }

  async handleSocialLogin(input: {
    providerId: string;
    email?: string;
    displayName?: string;
  }) {
    let user = input.email ? await this.findUserByEmail(input.email) : null;

    if (!user) {
      const randomPassword = await this.hashPassword(
        `${input.providerId}:${Date.now()}`,
      );
      const [firstName, ...rest] = input.displayName?.split(' ') || [''];
      const lastName = rest.length ? rest.join(' ') : 'lastname';

      user = await this.userService.create({
        firstName,
        lastName,
        email: input.email,
        password: randomPassword,
      } as UserCreateDto);

      user = await this.userService.getById(user.id);
    }

    if (!user?.id) {
      throw new UnauthorizedException(
        'Unable to authenticate via social provider',
      );
    }

    await this.verifyUser(user);

    const tokens = await this.generateAccessToken({
      id: user.id,
      role: user.role as UserRole,
    });

    return { tokens, user: this.sanitizeUser(user) };
  }

  /** ================= PASSWORD FLOWS ================== */

  async forgotPassword(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    await this.sendResetPasswordLink(user.id, user.email);
  }

  async resetPassword(
    token: string,
    newPassword: string,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<void> {
    const { email } = await this.decodeConfirmationToken(token);
    const user = await this.findUserByEmail(email);

    if (!user) throw new NotFoundException(`No user found for email: ${email}`);

    user.password = await this.hashPassword(newPassword);
    await this.userRepository._update(user, options);
  }

  async sendResetPasswordLink(userId: number, email: string): Promise<void> {
    const { resetToken } = await this.generateTokenForCredentialReset({
      id: userId,
      email,
    });

    const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const text = `Hi,\nTo reset your password, click here: ${url}\n\nThis link is valid for 15 minutes.`;

    // TODO: Integrate email service (e.g., MailerService)
   }

  async getForgetPassword(data: ForgotPasswordDto): Promise<string> {
    const user = await this.findUserByEmail(data.email);
    if (!user) throw new BadRequestException('Invalid email');

    await this.sendResetPasswordLink(user.id, user.email);
    return 'Check your email to reset password';
  }

  /** ================= OTP VERIFICATION ================== */

  async verifyOtp(email: string, otp: string) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const isValid = await this.otpService.verifyOtpForUser(user.id, otp);
    if (!isValid) throw new UnauthorizedException('Invalid or expired OTP');

    await this.verifyUser(user);

    return this.generateAccessToken({ id: user.id, role: user.role as UserRole});
  }
}
