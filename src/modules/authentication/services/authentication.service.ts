import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OtpService } from 'src/modules/otp/service/otp.service';
import { UserRole } from 'src/modules/user/constant/user-type.constant';
import { UserCreateDto } from 'src/modules/user/dto/user.create.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { UserService } from 'src/modules/user/services/user.service';
import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { CartService } from 'src/modules/cart/services/cart.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistService } from 'src/modules/wishlist/services/wishlist.service';
import { WishlistRepository } from 'src/modules/wishlist/repositories/wishlist.repository';
import { CartRepository } from 'src/modules/cart/repositories/cart.repository';
import { object } from 'joi';
import { CartItemRepository } from 'src/modules/cart-item/repositories/cart-item.repository';
import { BillingAddressService } from 'src/modules/billing-address/services/billing-address.service';
import { ShippingAddressService } from 'src/modules/shipping-address/services/shipping-address.service';

export type AccessTokenPayload = { sub: number; roles: UserRole };
export type TokenPayloadForCredentialReset = { sub: number; email: string };

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly _cartService: CartService,
    private readonly _wishlistRepo: WishlistRepository,
    private readonly _cartItemRepo: CartItemRepository,
    private readonly _billingAddressService: BillingAddressService,
    private readonly _shippingAddressService: ShippingAddressService,
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

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.verified) {
      throw new UnauthorizedException(
        'Account not verified. Please verify your email.',
      );
    }

    return this.sanitizeUser(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository._findOne({
      options: { where: { email }, withDeleted: false } as any,
      relations: { image: true },
    });
  }

  /** ================= LOGIN FLOWS ================== */

  async login(data: { email: string; password: string }) {
    const user = await this.validateUser(data.email, data.password);

    const token = await this.generateAccessToken({
      id: user.id,
      role: user.role as UserRole,
    });

    //   const wishlistcount=await this._wishlistRepo._findCount({options:{where:{userId:user.id}
    //   }})
    //  const cartCount=await this._cartItemRepo._findCount({options:{where:{ cart:{userId:user.id}
    //   }}})
    const defultBillingAddress = await this._billingAddressService.getOne({
      options: { where: { userId: user.id, default: true } },
    });
    const defultShippingAddress = await this._shippingAddressService.getOne({
      options: { where: { userId: user.id, default: true } },
    });
    const userData = {
      // wishlistcount,
      // cartCount,
      defultBillingAddress,
      defultShippingAddress,
    };

    return { token, user, userData };
  }

  async handleSocialLogin(input: {
    providerId: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
  }) {
    let user = input.email ? await this.findUserByEmail(input.email) : null;

    if (!user) {
      const randomPassword = await this.hashPassword(
        `${input.providerId}:${Date.now()}`,
      );
      const [firstName, ...rest] = input.displayName?.split(' ') || [''];
      const lastName = rest.length ? rest.join(' ') : 'lastname';
      console.log(`dat in handle locial${input.avatarUrl}`);
      user = await this.userService.create({
        firstName,
        lastName,
        email: input.email,
        image_url: input.avatarUrl,
        password: randomPassword,
      } as UserCreateDto);

      user = await this.userService.getById(user.id);
      const cart = await this._cartService.create({ userId: user.id });
      user.cart = cart;
      await this._userRepository.save(user);
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

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<void> {
    const user = await this.userRepository._findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isCurrentValid = await this.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await this.hashPassword(newPassword);
    await this.userRepository._update(user, options);
  }

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

    return this.generateAccessToken({
      id: user.id,
      role: user.role as UserRole,
    });
  }
}
