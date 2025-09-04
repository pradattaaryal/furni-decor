import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
 import { UserCreateDto } from 'src/modules/user/dto/user.create.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { OtpVerificationDto } from '../dto/otp-verification.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthenticationService } from '../services/authentication.service';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
 
@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Body() registerDto: UserCreateDto,
  ): Promise<
    IResponse<{
      user: object;
      otp: string;
      otpExpiresAt: Date;
      message: string;
    }>
  > {
    const result = await this.authService.register(registerDto);

    // Remove password before sending response
    const { password, ...rest } = result.user as UserEntity;

    return {
      data: {
        user: rest,
        otp: result.otp,
        otpExpiresAt: result.otpExpiresAt,
        message: 'User registered successfully. Please verify your OTP.',
      },
    };
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Verify OTP and activate user' })
  async verifyOtp(
    @Body() body: OtpVerificationDto,
  ): Promise<IResponse<{ accessToken: string; message: string }>> {
    const tokens = await this.authService.verifyOtp(body.email, body.otp);
    return {
      data: {
        accessToken: tokens.accessToken,
        message: 'OTP verified successfully. Tokens issued.',
      },
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Login with credentials' })
  async login(
    @Body() body: LoginDto,
  ): Promise<IResponse<{ tokens: object; user: object; message: string }>> {
    const tokens = await this.authService.login(body);

    return {
      data: {
        tokens: tokens.token,
        user: tokens.user,
        message: 'Login successful',
      },
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req: any): Promise<IResponse<{tokens: object; user: object; message: string }>>  {
    const profile = req.user as {
      providerId: string;
      email?: string;
      displayName?: string;
    };
    const result = await this.authService.handleSocialLogin({
       providerId: profile.providerId,
      email: profile.email,
      displayName: profile.displayName,
      
    });
    return {data: {
        tokens: result.tokens,
        user: result.user,
        message: 'Login successful',
      },};
  }
}
