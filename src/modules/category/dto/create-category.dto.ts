import { faker } from '@faker-js/faker';
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, MinLength, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ICategoryCreateDto } from '../interfaces/category.create.dto.interface';
import { IsCategoryIdValid, IsCategoryNameUnique } from '../validations';

export class CategoryCreateDto implements ICategoryCreateDto {
  @ApiProperty({
    example: faker.commerce.department(),
    description: 'Category name',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsCategoryNameUnique()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Parent category ID',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsCategoryIdValid()
  @Transform(({ value }: { value: any }) => value ? parseInt(value) : undefined)
  parent_id?: number;
}
