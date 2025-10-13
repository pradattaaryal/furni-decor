import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './wishlist.create.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {}