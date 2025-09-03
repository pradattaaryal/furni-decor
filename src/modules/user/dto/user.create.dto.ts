import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from '../constant/user-type.constant'; // Define enum: ADMIN | CUSTOMER | SELLER

export class UserCreateDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Unique email for the user',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password for user account',
  })
  @IsString()
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
 
role: string;
}
