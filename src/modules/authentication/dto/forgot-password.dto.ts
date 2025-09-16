import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  CustomIsEmail,
  CustomIsNotEmpty,
  CustomIsString,
  CustomMatches,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import {
  IChangeNewPassword,
  IForgotPassword,
  IForgotPasswordSet,
  IResetPasswordDto,
  IVerifyOtp,
  IVerifyToken,
} from '../interfaces/forgot-passowrd.dto.interface';
import { UserRole } from 'src/modules/user/constant/user-type.constant';

export class ForgotPasswordDto implements IForgotPassword {
  @ApiProperty({
    required: false,
    example: 'admin@gmail.com',
  })
  @CustomIsNotEmpty()
  @CustomIsEmail()
  @CustomMinLength(5)
  email: string;
}

export class ForgotPasswordSetDto implements IForgotPasswordSet {
  @ApiProperty({
    required: false,
    example: 'admin@gmail.com',
  })
  @CustomIsNotEmpty()
  @CustomIsEmail()
  @CustomMinLength(5)
  email: string;

  @ApiProperty({
    required: true,
    example: faker.internet.password(),
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*#?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    },
  )
  password: string;

  // @ApiProperty({
  //   required: true,
  //   example: '123456',
  // })
  // @CustomMinLength(6)
  // @CustomIsOptional()
  // @IsNumberString()
  // @CustomMaxLength(6)
  // otp?: string;

  @ApiProperty({
    required: true,
    example: 'Token',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  token: string;
}

export class VerifyOtpDto implements IVerifyOtp {
  @ApiProperty({
    required: false,
    example: 'admin@gmail.com',
  })
  @CustomIsNotEmpty()
  @CustomIsEmail()
  @CustomMinLength(5)
  email: string;

  @ApiProperty({
    required: true,
    example: '090989',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  otpCode: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    required: true,
    example: 'Test@123',
    description: 'password for admin',
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMinLength(8)
  @CustomMaxLength(20)
  @CustomMatches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
    },
  )
  password: string;
}

export class ResetPasswordDto implements IResetPasswordDto {
  @ApiProperty({
    required: false,
    example: 'token',
  })
  @CustomIsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
    example: 'Your password',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  password: string;
}

export class VerifyTokenDto implements IVerifyToken {
  @ApiProperty({
    required: false,
    example: 'admin@gmail.com',
  })
  @CustomIsNotEmpty()
  @CustomIsEmail()
  @CustomMinLength(5)
  email: string;

  @ApiProperty({
    required: true,
    example: 'Your token',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  token: string;
}

export type AccessTokenPayload = {
  sub: number;
  roles: UserRole;
};
export class ChangeNewPasswordDto implements IChangeNewPassword {
  @ApiProperty({
    required: true,
    example: 'Test@123',
    description: 'Old Password',
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    required: true,
    example: 'Test@123',
    description: 'New Password',
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMinLength(8)
  @CustomMaxLength(20)
  @CustomMatches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
    },
  )
  newPassword: string;
}
