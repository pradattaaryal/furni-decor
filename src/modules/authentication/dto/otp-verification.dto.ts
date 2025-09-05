import {
  CustomIsEmail,
  CustomIsNotEmpty,
  CustomIsString,
} from 'src/common/request/validators/custom-validator';
import { IOtpVerificationDto } from '../interfaces/otp-verification.dto.interface';
import { ApiProperty } from '@nestjs/swagger';

export class OtpVerificationDto implements IOtpVerificationDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'email used for register',
  })
  @CustomIsEmail({}, { message: 'Invalid email format' })
  @CustomIsNotEmpty({ message: 'Email is required' })
  readonly email: string;
  @ApiProperty({
    example: '654455',
    description: 'otp send to email',
  })
  @CustomIsString({ message: 'Otp must be a string' })
  @CustomIsNotEmpty({ message: 'Otp is required' })
  readonly otp: string;
}

// export class ResendOtpDto {
//   @IsEmail()
//   @IsNotEmpty()
//   readonly email: string;
// }
