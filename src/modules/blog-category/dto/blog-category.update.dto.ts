import { PartialType } from '@nestjs/swagger';
import { BlogCategoryCreateDto } from './blog-category.create.dto';
import { IBlogCategoryUpdateDto } from '../interfaces/blog-category.update.dto.interface';

export class BlogCategoryUpdateDto
  extends PartialType(BlogCategoryCreateDto)
  implements IBlogCategoryUpdateDto {}
