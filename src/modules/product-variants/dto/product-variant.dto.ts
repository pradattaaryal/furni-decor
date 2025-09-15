import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsString,
  CustomIsNumber,
} from 'src/common/request/validators/custom-validator';

export class ProductVariantDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  id: number;

  @ApiProperty({
    example: {
      height: '80cm',
      width: '120cm',
      depth: '75cm',
      seatHeight: '45cm',
      weight: '25kg',
    },
    description: 'Variant dimensions',
  })
  @CustomIsNotEmpty()
  dimensions: Record<string, any>;

  @ApiProperty({ example: 'Blue', description: 'Variant color' })
  @CustomIsNotEmpty()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  color: string;

  @ApiProperty({ example: 100.5, description: 'Price of variant' })
  @CustomIsNumber()
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock count' })
  @CustomIsNumber()
  count: number;

  @ApiProperty({ example: 12, description: 'Image ID for variant' })
  @CustomIsNumber()
  imageId: number;
}
