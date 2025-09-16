import { PartialType } from '@nestjs/swagger';
import { CategoryCreateDto } from './create-category.dto';
import { ICategoryUpdateDto } from '../interfaces/category.update.dto.interface';

export class CategoryUpdateDto
  extends PartialType(CategoryCreateDto)
  implements ICategoryUpdateDto {}
