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
 
  @ApiProperty({ example: 'Blue', description: 'Variant color' })
  @CustomIsNotEmpty()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  color: string;

  @ApiProperty({ example: 12, description: 'Image ID for variant' })
  @CustomIsNumber()
  imageId: number;
}
