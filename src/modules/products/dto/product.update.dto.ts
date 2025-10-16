import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { faker } from '@faker-js/faker';
import {
  CustomIsOptional,
  CustomIsString,
  CustomMinLength,
  CustomMaxLength,
  CustomIsNumber,
  CustomMin,
  CustomIsArray,
  CustomValidateNested,
  CustomIsStartBeforeEnd,
} from 'src/common/request/validators/custom-validator';
 import { ProductVariantDto } from 'src/modules/product-variants/dto/product-variant.dto';
import { IProductUpdateDto } from '../interfaces/product.update.dto.interface';

export class ProductUpdateDto implements IProductUpdateDto {
  @ApiProperty({
    example: faker.commerce.productName(),
    description: 'Product name',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(100)
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  name?: string;

  @ApiProperty({
    example: faker.commerce.productName(),
    description: 'Product tag',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(100)
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  tag?: string;

  @ApiProperty({
    example: {
      height: '80cm',
      width: '120cm',
      depth: '75cm',
      seatHeight: '45cm',
      weight: '25kg',
    },
    description: 'Variant dimensions',
    required: false,
  })
  @CustomIsOptional()
  dimensions?: Record<string, number>;

  @ApiProperty({
    example: 50,
    description: 'Available stock quantity',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => (value ? parseInt(value) : value))
  quantity?: number;

  @ApiProperty({
    example: faker.commerce.productDescription(),
    description: 'Product description',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMinLength(10)
  @CustomMaxLength(200)
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  description?: string;

  @ApiProperty({
    example: [
      {
        colorId: 1,
        imageId: 2,
      },
      {
        colorId: 3,
        imageId: 4,
      },
    ],
    description: 'Product variants array',
    type: [ProductVariantDto],
    required: false,
  })
  @CustomIsOptional()
  @CustomIsArray()
  @CustomValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiProperty({
    example: 'XYZ123',
    description: 'Model number',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  modelNumber?: string;

  @ApiProperty({
    example: 'Wood, Metal',
    description: 'Secondary material of the product',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  secondaryMaterial?: string;

  @ApiProperty({
    example: '2-seater, L-shape',
    description: 'Configuration details of the product',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  configuration?: string;

  @ApiProperty({
    example: 100.5,
    description: 'Price of variant',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => (value ? parseFloat(value) : value))
  price?: number;

  @ApiProperty({
    example: 'Leather',
    description: 'Upholstery material',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  upholsteryMaterial?: string;

  @ApiProperty({
    example: 'Brown',
    description: 'Upholstery color',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  upholsteryColor?: string;

  @ApiProperty({
    example: 'Foam',
    description: 'Filling material',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  fillingMaterial?: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of image IDs for the product',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsArray()
  images?: number[];

  @ApiProperty({
    example: 1,
    description: 'Main image ID for the product',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => (value ? parseInt(value) : value))
  mainImageId?: number;

  @ApiProperty({
    example: 'Matte',
    description: 'Finish type of the product',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  finishType?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the product has adjustable headrest',
    required: false,
  })
  @CustomIsOptional()
  adjustableHeadrest?: boolean;

  @ApiProperty({
    example: '120',
    description: 'Maximum load capacity in KG',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  maxLoad?: number;

  @ApiProperty({
    example: 1,
    description: 'Category ID',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @CustomMin(1)
  @Transform(({ value }: { value: any }) => (value ? parseInt(value) : value))
  categoryId?: number;

  @ApiProperty({
    example: 'Premium packaging with assembly guide',
    description: 'Sales package details',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(200)
  salesPackage?: string;

  @ApiProperty({
    example: 'Italy',
    description: 'Origin of manufacture',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(30)
  originOfManufacture?: string;

  @ApiProperty({
    example: 150.0,
    description: 'Discount value',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @CustomMin(0)
  @Transform(({ value }: { value: any }) => (value ? parseFloat(value) : value))
  discountValue?: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Discount start date',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  discountStartDate?: Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'Discount end date',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomIsStartBeforeEnd({
    message: 'Discount end date must be after the start date',
  })
  discountEndDate?: Date;

  @ApiProperty({
    example: '2 years manufacturer warranty',
    description: 'Warranty summary',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  warrantySummary?: string;

  @ApiProperty({
    example: 'On-site service',
    description: 'Warranty service type',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  warrantyServiceType?: string;

  @ApiProperty({
    example: 'Manufacturing defects, material quality issues',
    description: 'What is covered in warranty',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  coveredInWarranty?: string;

  @ApiProperty({
    example: 'Normal wear and tear, accidental damage',
    description: 'What is not covered in warranty',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  notCoveredInWarranty?: string;

  @ApiProperty({
    example: '2 years domestic warranty',
    description: 'Domestic warranty details',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  domesticWarranty?: string;
}