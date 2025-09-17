import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsNumber,
  CustomIsEmail,
  CustomIsNotEmpty,
  CustomIsOptional,
  CustomIsString,
  CustomMatches,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import { IUserCreateDto } from '../interfaces/user.create.dto.interface';
import { UserRole } from '../constant/user-type.constant';
import { IsBoolean, IsOptional } from 'class-validator';

export class MarketingUserCreateDto implements IUserCreateDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Unique email for the user',
  })
  @CustomIsEmail({}, { message: 'Email must be valid' })
  @CustomIsNotEmpty({ message: 'Email must not be empty' })
  @CustomIsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password for user account',
  })
  @CustomIsString({ message: 'Password must be a string' })
  @CustomMaxLength(50, { message: 'Password is too long' })
  @CustomMinLength(6, { message: 'Password is too short' })
  @CustomMatches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
    },
  )
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: false,
  })
  @CustomIsNotEmpty({ message: 'First Name must not be a Empty' })
  @CustomIsString({ message: 'First Name must be a string' })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: false,
  })
  @CustomIsNotEmpty({ message: 'Last Name must not be a Empty' })
  @CustomIsString({ message: 'Last Name must be a string' })
  lastName?: string;

  @ApiProperty({
    example: 123,
    description: 'uploaded image Id',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  imageId?: number | undefined;

  //   @ApiProperty({
  //     example: UserRole.MARKETING,
  //     description: 'Role of the user',
  //     required: false,
  //     default: UserRole.MARKETING, // Swagger UI shows this as default
  //     enum: UserRole,
  //   })
  //   role: UserRole = UserRole.MARKETING;

  //   @ApiProperty({
  //     example: true,
  //     description: 'Whether the user is verified',
  //     required: false,
  //     default: true,
  //   })
  //   @CustomIsBoolean({ message: 'Verified must be a boolean' })
  //   verified: boolean = true; // default applied
}
