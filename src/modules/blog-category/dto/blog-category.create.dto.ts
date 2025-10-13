import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsOptional,
  CustomIsString,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import { IBlogCategoryCreateDto } from '../interfaces/blog-category.create.dto.interface';

export class BlogCategoryCreateDto implements IBlogCategoryCreateDto {
  @ApiProperty({
    example: faker.commerce.product.name,
    description: 'Blog category name',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(255)
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  name: string;

  @ApiProperty({
    example: faker.lorem.paragraphs(),
    description: 'Blog category description',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(1000)
  description?: string;
}
