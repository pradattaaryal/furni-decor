import {
  CustomIsNumber,
  CustomIsNotEmpty,
  CustomIsOptional,
} from 'src/common/request/validators/custom-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWishlistDto {
  @ApiProperty({ example: 42, description: 'ID of the wishlist' })
  @CustomIsNumber()
  @CustomIsNotEmpty()
  wishlistId: number;
}
