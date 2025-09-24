import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
} from 'src/common/request/validators/custom-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID of the order this item belongs to',
    example: 101,
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  orderId: number;

  @ApiProperty({
    description: 'ID of the product being ordered',
    example: 55,
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  productId: number;

  @ApiProperty({
    description: 'ID of the product variant (if applicable)',
    example: 3,
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  variantId?: number;

  @ApiProperty({
    description: 'Quantity of the product in the order',
    example: 2,
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Price per unit of the product',
    example: 499.99,
  })
  @CustomIsNotEmpty()
  @CustomIsNumber({ maxDecimalPlaces: 2 })
  price: number;
}
