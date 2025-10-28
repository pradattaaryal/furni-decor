import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsOptional,
  CustomIsString,
  CustomIsNumber,
  CustomIsBoolean,
  CustomMaxLength,
  CustomMinLength,
  CustomMin,
} from 'src/common/request/validators/custom-validator';
import { IHomePageBannerCreateDto } from '../interfaces/home-page-banner.create.dto.interface';

export class HomePageBannerCreateDto implements IHomePageBannerCreateDto {
  @ApiProperty({
    example: 'Summer Sale 2024',
    description: 'Banner title',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(255)
  @Transform(({ value }: { value: string }) => value.trim())
  title: string;

  @ApiProperty({
    example: 'Get up to 50% off on all furniture',
    description: 'Banner description',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(500)
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Image ID for the banner',
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @Transform(({ value }: { value: any }) => parseInt(value))
  imageId: number;

  @ApiProperty({
    example: '/products?category=furniture',
    description: 'Link URL for the banner',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(500)
  link?: string;

  @ApiProperty({
    example: 1,
    description: 'Display order index (lower numbers appear first)',
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @CustomMin(0)
  @Transform(({ value }: { value: any }) => parseInt(value))
  orderIndex: number;

  @ApiProperty({
    example: true,
    description: 'Whether the banner is active',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsBoolean()
  @Transform(
    ({ value }: { value: any }) =>
      value === 'true' || value === true || value === 1 || value === '1',
  )
  isActive?: boolean;
}
