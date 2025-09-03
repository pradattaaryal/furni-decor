import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OtpVerificationDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly otp: string;
}

export class ResendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
