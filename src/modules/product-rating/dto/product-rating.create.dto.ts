// src/modules/product-rating/dto/product-rating-create.dto.ts

import { IsInt, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductRatingCreateDto {
  @ApiProperty({ example: 5, description: 'Rating between 1 and 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isApproved: boolean;
}
