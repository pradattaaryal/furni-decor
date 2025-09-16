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
import { IParentCategoryCreateDto } from '../interfaces/parent-category.create.dto.interface';

export class ParentCategoryCreateDto implements IParentCategoryCreateDto {
  @ApiProperty({
    example: faker.commerce.department(),
    description: 'Category name',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(255)
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  name: string;

  @ApiProperty({
    example: 'faker.product.description()',
    description: 'category description',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(1000)
  @Transform(({ value }: { value: string }) => value?.trim())
  description?: string;
}
