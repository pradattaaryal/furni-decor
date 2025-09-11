import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { faker } from '@faker-js/faker';
import {
  CustomIsNotEmpty,
  CustomIsString,
  CustomMinLength,
  CustomMaxLength,
  CustomIsOptional,
  CustomIsNumber,
  CustomMin,
} from 'src/common/request/validators/custom-validator';
import { IProductCreateDto } from '../interfaces/product.create.dto.interface';

export class ProductCreateDto implements IProductCreateDto {
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
    example: 150.00,
    description: 'Discount value',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  @CustomMin(0)
  @Transform(({ value }: { value: any }) => value ? parseFloat(value) : undefined)
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
