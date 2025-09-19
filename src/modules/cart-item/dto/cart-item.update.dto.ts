import { PartialType } from '@nestjs/swagger';
import { ICartItemUpdateDto } from '../interfaces/cart-item.update.dto.interface';
import { CreateCartItemDto } from './cart-item.create.dto';

export class CartItemUpdateDto
  extends PartialType(CreateCartItemDto)
  implements ICartItemUpdateDto {}
