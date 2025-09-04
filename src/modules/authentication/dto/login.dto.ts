 import { CustomIsEmail, CustomIsNotEmpty, CustomIsString } from 'src/common/request/validators/custom-validator';

export class LoginDto {
  @CustomIsEmail({},{ message: 'Invalid email format' })
  @CustomIsNotEmpty({message: 'Email is required' })
  email: string;

  @CustomIsString({message: 'Password must be a string' })
  @CustomIsNotEmpty({message: 'Password is required' })
  password: string;
}
