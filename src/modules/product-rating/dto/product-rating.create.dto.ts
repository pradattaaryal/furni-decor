import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsString,
  CustomMaxLength,
  CustomMin,
  CustomMax,
} from 'src/common/request/validators/custom-validator';
import { IProductRatingCreateDto } from '../interfaces/product-rating.create.dto.interface';
import {
  RATING_VALUE,
  RATING_MIN,
  RATING_MAX,
} from '../constants/product-rating.constant';

export class ProductRatingCreateDto implements IProductRatingCreateDto {
  @ApiProperty({
    example: 5,
    description: 'Rating between 1 and 5',
    enum: RATING_VALUE,
    minimum: RATING_MIN,
    maximum: RATING_MAX,
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @CustomMin(RATING_MIN)
  @CustomMax(RATING_MAX)
  @Transform(({ value }: { value: any }) => parseInt(value, 10))
  rating: RATING_VALUE;

  @ApiProperty({ example: 1, description: 'Related product ID' })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value, 10))
  productId: number;
}
