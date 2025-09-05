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
import { DataSource } from 'typeorm';
import { OAuthProvider } from '../constant/login-provider';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';

export type AccessTokenPayload = { sub: number; roles: UserRole };
export type  TokenPayloadForCredentialReset = { sub: number; email: string };

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

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



  async forgotPassword(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    await this.sendResetPasswordLink(user.id, email);
  }




 

async resetPassword(token: string, password: string,options?: IUpdateOptions<UserEntity>,): Promise<void> {
 
  const { userId, email } = await this.decodeConfirmationToken(token);

  const user =await this.findUserByEmail(email);
  if (!user) {
    throw new NotFoundException(`No user found for email: ${email}`);
  }

   const hashedPassword = bcrypt.hashSync(password, 10);  
    user.password = hashedPassword;
  await this.userRepository._update(user,options);


}







async decodeConfirmationToken(token: string): Promise<{ userId: number; email: string }> {
  try {
    const payload = await this.jwtService.verifyAsync<TokenPayloadForCredentialReset>(token, {
    });

    return { userId: payload.sub, email: payload.email };
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }
}















 async generateTokenForCredentialReset(user: { id: number; email: string }) {
    const payload: TokenPayloadForCredentialReset = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { ResetToken: token };
}


  public async sendResetPasswordLink(userId: number, email: string): Promise<void> {
    // 1. Sign JWT token with short expiry
 
  const token = await this.generateTokenForCredentialReset({
      id: userId,
      email:email,
    });

    // 2. Build reset link
    const url =  token 

    const text = `Hi,\nTo reset your password, click here: ${url}\n\nThis link is valid for 15 minutes.`;

    // 3. Send mail here
   
  }

















  async login(data: { email: string; password: string }) {
    const email = data.email;
    const password = data.password;
    const user = await this.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    console.log(password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.verified) throw new UnauthorizedException('Account not verified');

    const token = await this.generateAccessToken({
      id: user.id,
      role: user.role as UserRole,
    });
    const { password: _, ...safeUser } = user;
    return {
      token: token,
      user: safeUser,
    };
  }

  async findUserByEmail(email: string): Promise<UserEntity | false> {
    const user = await this.userRepository._findOne({
      options: { where: { email }, withDeleted: false } as any,
    });
    return user || false;
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepository._findOne({
      options: { where: { email } },
    });
    if (!user) throw new BadRequestException('User not found');

    const ok = await this.otpService.verifyOtpForUser(user.id, otp);
    if (!ok) throw new UnauthorizedException('Invalid or expired OTP');

    // Reuse extracted method
    await this.verifyUser(user);

    return this.generateAccessToken({
      id: user.id,
      role: user.role as UserRole,
    });
  }

  async getForgetPassword(data: ForgotPasswordDto): Promise<string> {
    const existingUser = await this.findUserByEmail(data.email);

    if (!existingUser) {
      throw new BadRequestException('Invalid Email');
    }
    // console.log(`Sending password reset email to: ${existingUser.email}`);

    // await this.sendForgotPasswordVerification(existingUser);
    return 'Check your email to reset password';
  }

  private async verifyUser(user: UserEntity): Promise<UserEntity> {
    if (user.verified) return user; // already verified, skip update

    user.verified = true;
    return this.userRepository._update(user);
  }
  async handleSocialLogin(input: {
    providerId: string;
    email?: string;
    displayName?: string;
  }) {
    let user: UserEntity | null = null;

    if (input.email) {
      const userExist = await this.findUserByEmail(input.email);
      if (userExist) {
        user = userExist;
      }
    }

    if (!user) {
      // Generate random password
      const randomPassword = bcrypt.hashSync(
        `${input.providerId}:${Date.now()}`,
        10,
      );

      let firstName = '';
      let lastName = '';
      if (input.displayName) {
        const nameParts = input.displayName.trim().split(' ');
        firstName = nameParts.shift() || ''; // first element
        lastName = nameParts.length ? nameParts.join(' ') : 'lastname'; // rest as lastName or empty
      }

      // Create the user
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
    const { password, ...safeUser } = user as any;

    return { tokens, user: safeUser };
  }
}
