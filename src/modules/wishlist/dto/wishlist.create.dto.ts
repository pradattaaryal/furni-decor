import {
  CustomIsNumber,
  CustomIsNotEmpty,
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
}
