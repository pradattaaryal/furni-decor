import { PartialType } from '@nestjs/swagger';
import { ProductCreateDto } from './create-product.dto';
import { IProductUpdateDto } from '../interfaces/product.update.dto.interface';

export class ProductUpdateDto extends PartialType(ProductCreateDto) implements IProductUpdateDto {}
