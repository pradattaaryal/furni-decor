import {
  CustomIsNumber,
  CustomIsNotEmpty,
  CustomIsOptional,
} from 'src/common/request/validators/custom-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
  @ApiProperty({
    example: 42,
    description: 'ID of the product to be added to wishlist',
  })
  @CustomIsNumber()
  @CustomIsNotEmpty()
  productId: number;

  @ApiProperty({
    example: 15,
    description: 'ID of the product variant (optional)',
    required: false,
  })
  @CustomIsNumber()
  variantId: number;
}
