import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsString,
} from 'src/common/request/validators/custom-validator';
import { IProductVariantCreateDto } from '../interfaces/product-variant.create.dto.interface';

export class ProductVariantCreateDto implements IProductVariantCreateDto {
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
  dimensions: Record<number, any>;

  @ApiProperty({ example: 'red', description: 'Variant color' })
  @CustomIsNotEmpty()
  @CustomIsString()
  color: string;

  @ApiProperty({ example: 50, description: 'Available stock  quantity' })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value))
  quantity: number;

  @ApiProperty({ example: 1, description: 'Related product id' })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value))
  productId: number;

  @ApiProperty({ example: 12, description: 'Image ID for variant' })
  @CustomIsOptional()
  @CustomIsNumber()
  imageId: number;
}
