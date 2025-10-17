import { PartialType } from '@nestjs/swagger';
import { ProductRatingCreateDto } from './product-rating.create.dto';
import { IProductRatingUpdateDto } from '../interfaces/product-rating.update.dto.interface';

export class ProductRatingUpdateDto
  extends PartialType(ProductRatingCreateDto)
  implements IProductRatingUpdateDto {}
