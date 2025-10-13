import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
} from 'src/common/request/validators/custom-validator';
import { IProductVariantCreateDto } from '../interfaces/product-variant.create.dto.interface';

export class ProductVariantCreateDto implements IProductVariantCreateDto {
  @ApiProperty({ example: 1, description: 'Related product id' })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value))
  productId: number;

  @ApiProperty({ example: 1, description: 'Variant color id', required: false })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => (value !== undefined ? parseInt(value) : undefined))
  colorId?: number  ;

  @ApiProperty({ example: 12, description: 'Image ID for variant', required: false })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => (value !== undefined ? parseInt(value) : undefined))
  imageId?: number  ;
}
