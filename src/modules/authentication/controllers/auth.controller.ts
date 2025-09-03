 
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UserRole } from 'src/modules/user/constant/user-type.constant';
import { UserCreateDto } from 'src/modules/user/dto/user.create.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { OtpVerificationDto } from '../dto/otp-verification.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthenticationService } from '../services/authentication.service';
 
 
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthenticationService,
 
  ) {}

  @Post('/register')
  async register(@Body() registerDto: UserCreateDto) {
    const result = await this.authService.register(registerDto);

    const { password, ...rest } = result.user as any;
    return {
      user: rest,
      verificationOtpSent: false,
      otp: result.otp,
      otpExpiresAt: result.otpExpiresAt,
    };
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() body: OtpVerificationDto) {
    const tokens = await this.authService.verifyOtp(body.email, body.otp);
    return tokens;
  }

@UseGuards(LocalAuthGuard)
@Post('/login')
async login(@Request() req: Express.Request) {
  if (!req.user) throw new InternalServerErrorException();

   const userPayload = {
    id: (req.user as UserEntity).id,
    role: (req.user as UserEntity).role as UserRole,  
  };

  const tokens = await this.authService.generateAccessToken(userPayload);

  return {
    tokens,
    user: req.user, 
  };
}

  // Google OAuth (kept commented for future use)
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() { return; }

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleCallback(@Request() req: any) { /* ... */ }
 
}
