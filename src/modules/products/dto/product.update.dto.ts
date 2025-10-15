import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { faker } from '@faker-js/faker';
import {
  CustomIsNotEmpty,
  CustomIsString,
  CustomMinLength,
  CustomMaxLength,
  CustomIsOptional,
  CustomIsNumber,
  CustomMin,
  CustomIsArray,
  CustomValidateNested,
  CustomIsFutureDate,
  CustomIsStartBeforeEnd,
} from 'src/common/request/validators/custom-validator';
import { IProductCreateDto } from '../interfaces/product.create.dto.interface';
import { ProductVariantDto } from 'src/modules/product-variants/dto/product-variant.dto';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { ProductVariantCreateDto } from 'src/modules/product-variants/dto/product-variant.create.dto';

export class ProductUpdateDto implements IProductCreateDto {
  @ApiProperty({
    example: faker.commerce.productName(),
    description: 'Product name',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(100)
  @Transform(({ value }: { value: string }) => value.trim())
  name: string;

  @ApiProperty({
    example: faker.commerce.productName(),
    description: 'Product tag',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(100)
  @Transform(({ value }: { value: string }) => value.trim())
  tag: string;
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
  dimensions: Record<string, number>;

  @ApiProperty({ example: 50, description: 'Available stock  quantity' })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value))
  quantity: number;

  @ApiProperty({
    example: faker.commerce.productDescription(),
    description: 'Product description',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(10)
  @CustomMaxLength(200)
  @Transform(({ value }: { value: string }) => value.trim())
  description: string;

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

  @ApiProperty({ example: 100.5, description: 'Price of variant' })
  @CustomIsOptional()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseFloat(value))
  price: number;

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
  images: number[];

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

  // ================= Additional Product Specifications End =================

  @ApiProperty({
    example: 1,
    description: 'Category ID',
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @CustomMin(1)
  @Transform(({ value }: { value: any }) => parseInt(value))
  categoryId: number;

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
  @Transform(({ value }: { value: any }) =>
    value ? parseFloat(value) : undefined,
  )
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
