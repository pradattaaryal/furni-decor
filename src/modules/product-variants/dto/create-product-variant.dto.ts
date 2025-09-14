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
  @ApiProperty({ example: { width: 20, height: 30 }, description: 'Variant dimensions' })
  @CustomIsNotEmpty()
  dimensions: Record<string, any>;

  @ApiProperty({ example: 'red', description: 'Variant color' })
  @CustomIsNotEmpty()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  color: string;

  @ApiProperty({ example: 1, description: 'Related product id' })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value))
  productId: number;
} 