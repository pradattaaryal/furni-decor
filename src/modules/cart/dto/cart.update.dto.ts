import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsBoolean,
  CustomIsNumber,
  CustomIsOptional,
} from 'src/common/request/validators/custom-validator';
import { IUpdateCartDto } from '../interfaces/cart.update.dto.interface';

export class UpdateCartDto implements IUpdateCartDto {
  @ApiProperty({ example: 1, description: 'ID of the user owning the cart' })
  @CustomIsNumber()
  cartId: number;
  @ApiProperty({ example: 1, description: 'ID of the user owning the cart' })
  @CustomIsNumber()
  totalPrice: number;
}
