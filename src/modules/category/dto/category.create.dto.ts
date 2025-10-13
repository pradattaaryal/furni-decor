import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsString,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import { ICategoryCreateDto } from '../interfaces/category.create.dto.interface';

export class CategoryCreateDto implements ICategoryCreateDto {
  @ApiProperty({
    example: faker.commerce.product.name,
    description: 'Category name',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(255)
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Parent category ID',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) =>
    value ? parseInt(value) : undefined,
  )
  parent_id?: number;

  @ApiProperty({
    example: faker.lorem.paragraphs(),
    description: 'category description',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(1000)
  description?: string;
}
