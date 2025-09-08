import {
  CustomIsEmail,
  CustomIsNotEmpty,
  CustomIsString,
  CustomMatches,
} from 'src/common/request/validators/custom-validator';
import { IloginDto } from '../interfaces/login.create.dto.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements IloginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'eamail used for login',
  })
  @CustomIsEmail({}, { message: 'Invalid email format' })
  @CustomIsNotEmpty({ message: 'Email is required' })
  email: string;
  @ApiProperty({
    example: '123sdasd465',
    description: 'same password used for register',
  })
  @CustomIsString({ message: 'Password must be a string' })
  @CustomIsNotEmpty({ message: 'Password is required' })
  @CustomMatches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
    },
  )
  password: string;
}
