import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsBoolean,
  CustomIsNumber,
  CustomIsOptional,
} from 'src/common/request/validators/custom-validator';
import { ICreateCartDto } from '../interfaces/cart.create.dto.interface';

export class CreateCartDto implements ICreateCartDto {
  @ApiProperty({ example: 1, description: 'ID of the user owning the cart' })
  @CustomIsNumber()
  userId: number;
}
