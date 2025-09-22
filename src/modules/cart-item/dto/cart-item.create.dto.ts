import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsNumber,
  CustomIsOptional,
} from 'src/common/request/validators/custom-validator';
import { ICartItemCreateDto } from '../interfaces/cart-item.create.dto.interface';

export class CreateCartItemDto implements ICartItemCreateDto {
  @ApiProperty({ example: 1, description: 'Cart ID' })
  @CustomIsNumber()
  cartId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  @CustomIsNumber()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Variant ID (optional)',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  variantId?: number;

  @ApiProperty({ example: 1, description: 'Quantity' })
  @CustomIsNumber()
  quantity: number;
}
