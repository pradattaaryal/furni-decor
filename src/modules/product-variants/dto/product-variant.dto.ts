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
      height: 80,
      width: 120,
      depth: 75,
      seatHeight: 45,
      weight: 25,
    },
    description: 'Variant dimensions',
  })
  @CustomIsNotEmpty()
  dimensions: Record<string, number>;

  @ApiProperty({ example: 'Blue', description: 'Variant color' })
  @CustomIsNotEmpty()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  color: string;

  @ApiProperty({ example: 50, description: 'Available stock  quantity' })
  @CustomIsNumber()
  quantity: number;

  @ApiProperty({ example: 12, description: 'Image ID for variant' })
  @CustomIsNumber()
  imageId: number;
}
