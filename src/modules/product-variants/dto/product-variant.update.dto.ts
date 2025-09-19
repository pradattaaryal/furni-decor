import { PartialType } from '@nestjs/swagger';
import { ProductVariantCreateDto } from './product-variant.create.dto';
import { IProductVariantUpdateDto } from '../interfaces/product-variant.update.dto.interface';

export class ProductVariantUpdateDto
  extends PartialType(ProductVariantCreateDto)
  implements IProductVariantUpdateDto {}
