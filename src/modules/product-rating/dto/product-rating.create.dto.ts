import { IsInt, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomIsNotEmpty, CustomIsNumber } from 'src/common/request/validators/custom-validator';
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
}
