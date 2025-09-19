import { PartialType } from '@nestjs/swagger';
import { CategoryCreateDto } from './category.create.dto';
import { ICategoryUpdateDto } from '../interfaces/category.update.dto.interface';

export class CategoryUpdateDto
  extends PartialType(CategoryCreateDto)
  implements ICategoryUpdateDto {}
