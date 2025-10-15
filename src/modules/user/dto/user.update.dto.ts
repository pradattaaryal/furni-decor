import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsEmail,
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsString,
  CustomMatches,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import {
  IUserCreateDto,
  IUserUpdateDto,
} from '../interfaces/user.create.dto.interface';

export class UserUpdateDto implements IUserUpdateDto {
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
  imageId?: number;
}
