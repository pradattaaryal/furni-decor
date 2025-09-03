import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from '../constant/user-type.constant'; // Define enum: ADMIN | CUSTOMER | SELLER
import { CustomIsEmail, CustomIsEnum, CustomIsOptional, CustomIsString, CustomMaxLength, CustomMinLength } from 'src/common/request/validators/custom-validator';
import { IUserCreateDto } from '../interfaces/user.create.dto.interface';

export class UserCreateDto implements IUserCreateDto{
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Unique email for the user',
  })
  @CustomIsEmail({}, { message: 'Email must be valid' })
  email: string;
  
  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password for user account',
  })
  @CustomIsString({ message: 'Password must be a string' })
  @CustomMaxLength(12, { message: 'Password is too long' })
  @CustomMinLength(6, { message: 'Password is too long' })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: false,
  })
  @IsOptional()
  @CustomIsString()
  lastName?: string;

//  @CustomIsEnum(UserRole, { message: 'Role must be a valid UserRole' })
//   @ApiProperty({
//     example: UserRole.CUSTOMER,
//     description: 'Role assigned to the user',
//     enum: UserRole,
//     default: UserRole.CUSTOMER,
//   })
//   role: string;
}
