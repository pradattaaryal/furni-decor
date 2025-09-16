import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsStartBeforeEnd,
  CustomIsString,
  CustomMaxLength,
  CustomMin,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import { IProductUpdateDto } from '../interfaces/product.update.dto.interface';

export class ProductUpdateDto implements IProductUpdateDto {
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
    example: faker.commerce.productDescription(),
    description: 'Product description',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(10)
  @CustomMaxLength(200)
  @Transform(({ value }: { value: string }) => value.trim())
  description: string;

  // ================= Additional Product Specifications Start =================

  @ApiProperty({
    example: 'XYZ123',
    description: 'Model number',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  modelNumber?: string;

  @ApiProperty({
    example: 'Wood, Metal',
    description: 'Secondary material of the product',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  secondaryMaterial?: string;

  @ApiProperty({
    example: '2-seater, L-shape',
    description: 'Configuration details of the product',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  configuration?: string;

  @ApiProperty({
    example: 'Leather',
    description: 'Upholstery material',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  upholsteryMaterial?: string;

  @ApiProperty({
    example: 'Brown',
    description: 'Upholstery color',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  upholsteryColor?: string;

  @ApiProperty({
    example: 'Foam',
    description: 'Filling material',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  fillingMaterial?: string;

  @ApiProperty({
    example: 'Matte',
    description: 'Finish type of the product',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  finishType?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the product has adjustable headrest',
    required: false,
  })
  @CustomIsOptional()
  adjustableHeadrest?: boolean;

  @ApiProperty({
    example: '120kg',
    description: 'Maximum load capacity',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  maxLoad?: string;

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
  @Transform(({ value }: { value: string }) => value?.trim())
  salesPackage?: string;

  @ApiProperty({
    example: 'Italy',
    description: 'Origin of manufacture',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(30)
  @Transform(({ value }: { value: string }) => value?.trim())
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
  @Transform(({ value }: { value: string }) => value?.trim())
  warrantySummary?: string;

  @ApiProperty({
    example: 'On-site service',
    description: 'Warranty service type',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  warrantyServiceType?: string;

  @ApiProperty({
    example: 'Manufacturing defects, material quality issues',
    description: 'What is covered in warranty',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  coveredInWarranty?: string;

  @ApiProperty({
    example: 'Normal wear and tear, accidental damage',
    description: 'What is not covered in warranty',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  notCoveredInWarranty?: string;

  @ApiProperty({
    example: '2 years domestic warranty',
    description: 'Domestic warranty details',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  domesticWarranty?: string;
}
