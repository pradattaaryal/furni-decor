import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { OtpVerificationDto } from '../dto/otp-verification.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthenticationService } from '../services/authentication.service';
import { Throttle } from '@nestjs/throttler';
import { ApiDocs } from 'src/common/doc/common-docs';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dto/forgot-password.dto';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthAdminController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Verify OTP and activate user' })
  async verifyOtp(
    @Body() verificationDto: OtpVerificationDto,
  ): Promise<IResponse<{ accessToken: string; message: string }>> {
    const tokens = await this.authService.verifyOtp(
      verificationDto.email,
      verificationDto.otp,
    );
    return {
      data: {
        accessToken: tokens.accessToken,
        message: 'OTP verified successfully. Tokens issued.',
      },
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
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

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('forgot-password')
  @ApiDocs({
    operation: 'Forgot password ',
    jwtAccessToken: false,
  })
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(body.email);
  }
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('reset-password')
  @ApiDocs({
    operation: 'Password reset',
    jwtAccessToken: false,
  })
  async resetPassword(@Body() body: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req: any) {
  const redirectUrl = req.query.redirect || '/';  
  req.session.redirectUrl = redirectUrl;  
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Request() req: any,
  ): Promise<IResponse<{ tokens: object; user: object; message: string }>> {
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

  const redirectUrl = req.session.redirectUrl || '/';
  delete req.session.redirectUrl; // clean up

    const query = new URLSearchParams({
    accessToken: result.tokens.accessToken,
    user: JSON.stringify(result.user),
  }).toString();

    // return {
    //   data: {
    //     tokens: result.tokens,
    //     user: result.user,
    //     message: 'Login successful',
    //   },
    // };
    return req.res.redirect(`${redirectUrl}?${query}`);
  }
}
