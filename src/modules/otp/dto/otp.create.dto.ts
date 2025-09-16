import {
  CustomIsNotEmpty,
  CustomIsString,
} from 'src/common/request/validators/custom-validator';
import { IOptEntity } from '../interface/otp.create.dto.interface';

export class OtpCreateDto implements IOptEntity {
  @CustomIsNotEmpty({ message: 'user_id is required' })
  @CustomIsString({ message: 'user_id must be a string' })
  user_id: string;
}
