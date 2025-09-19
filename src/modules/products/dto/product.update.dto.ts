import { PartialType } from '@nestjs/swagger';
import { ProductCreateDto } from './product.create.dto';
import { IProductCreateDto } from '../interfaces/product.create.dto.interface';
import { IProductUpdateDto } from '../interfaces/product.update.dto.interface';

export class ProductUpdateDto
  extends PartialType(ProductCreateDto)
  implements IProductUpdateDto {}
