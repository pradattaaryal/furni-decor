import { IsInt, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsString,
  CustomMaxLength,
} from 'src/common/request/validators/custom-validator';
import { Transform } from 'class-transformer';

export class ProductRatingCreateDto {
  @ApiProperty({ example: 5, description: 'Rating between 1 and 5' })
  @CustomIsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 1, description: 'Related product id' })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value))
  productId: number;

  @ApiProperty({
    example: 1,
    description: 'Parent comment ID',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) =>
    value ? parseInt(value) : undefined,
  )
  parent_id?: number;

  @ApiProperty({
    example: 'Best product line up i have evere laid my eye on',
    description: 'comment',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(1000)
  @Transform(({ value }: { value: string }) => value?.trim())
  comment?: string;

}
