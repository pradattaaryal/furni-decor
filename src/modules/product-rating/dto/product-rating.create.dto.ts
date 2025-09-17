// src/modules/product-rating/dtos/product-rating.create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Min, Max } from 'class-validator';
import { extend } from 'joi';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsString,
  CustomMax,
  CustomMaxLength,
  CustomMin,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import { IProductRatingCreateDto } from '../interfaces/product-rating.create.dto.interface';

export class ProductRatingCreateDto implements IProductRatingCreateDto {
  @ApiProperty({ example: 5, description: 'Rating between 1 and 5' })
  @CustomIsNumber()
  @CustomMinLength(1)
  @CustomMaxLength(5)
  rating: number;

  @ApiProperty({ example: 1, description: 'Related product ID' })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value, 10))
  productId: number;

  @ApiProperty({
    example: 42,
    description: 'Parent rating ID (for nested comments)',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) =>
    value ? parseInt(value, 10) : undefined,
  )
  parentId?: number;

  @ApiProperty({
    example: 'Best product lineup I have ever laid my eyes on',
    description: 'Optional comment text',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(1000)
  @Transform(({ value }: { value: string }) => value?.trim())
  comment?: string;
}
