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
import { OAuthProvider } from '../constant/login-provider';

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

  async login(data: { email: string; password: string }) {
    const email = data.email;
    const password = data.password;
    const user = await this.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
console.log(password,user.password);
    const isMatch = await bcrypt.compare(password,user.password);
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
    });  const { password, ...safeUser } = user as any;

  return { tokens, user: safeUser };
}


  
}
