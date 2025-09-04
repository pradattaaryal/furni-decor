 import { CustomIsEmail, CustomIsNotEmpty, CustomIsString } from 'src/common/request/validators/custom-validator';

export class OtpVerificationDto {
  @CustomIsEmail({},{ message: 'Invalid email format' })
  @CustomIsNotEmpty({message: 'Email is required' })
  readonly email: string;

  @CustomIsString({message: 'Otp must be a string' })
  @CustomIsNotEmpty({message: 'Otp is required' })
  readonly otp: string;
}

// export class ResendOtpDto {
//   @IsEmail()
//   @IsNotEmpty()
//   readonly email: string;
// }
 