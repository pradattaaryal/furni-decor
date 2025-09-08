import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { DateGroupType } from 'src/common/helper/interfaces/helper.interface';
import {
  CustomIsEnum,
  CustomIsISO9601DateString,
  CustomIsNumber,
  CustomIsOptional,
  CustomMax,
  CustomMin,
  CustomTransformStringToBoolean,
  CustomTransformStringToNumber,
} from 'src/common/request/validators/custom-validator';
import { PaginateQueryWithSkipDto } from './paginateQuery.dto';
//import { EVENT_TYPES } from 'src/modules/events/constants/event.constant';

export enum DateRangeType {
  RANGE = 'RANGE',
  DATE = 'DATE',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  WEEK = 'WEEK',
}

export enum YearAndMonthDateType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum DateType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class DateTypeDto {
  @ApiPropertyOptional({
    description: 'Type of date range',
    enum: DateType,
  })
  @IsOptional()
  @IsEnum(DateType)
  dateRangeType: DateType;
}

export class DateGroupQueryDto {
  @ApiProperty({
    description: 'Type of date range',
    enum: DateGroupType,
  })
  @IsNotEmpty()
  @IsEnum(DateGroupType)
  dateGroupType: DateGroupType;
}

export class DateRangeQueryDto extends PaginateQueryWithSkipDto {
  @ApiPropertyOptional({
    description: 'Type of date range',
    enum: DateRangeType,
  })
  @IsOptional()
  @IsEnum(DateRangeType)
  dateRangeType: DateRangeType;

  @ApiPropertyOptional({
    description: 'The reference date for DATE and WEEK types, eg: `2023-03-28`',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description:
      'Start date for RANGE type, eg:`2024-03-28T05:39:23.248+00:00`',
    example: new Date(),
  })
  @ValidateIf((o) => o.dateRangeType === DateRangeType.RANGE)
  @IsNotEmpty()
  @CustomIsISO9601DateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'End date for RANGE type, eg:`2024-03-28T05:39:23.248+00:00`',
    example: new Date(),
  })
  @ValidateIf((o) => o.dateRangeType === DateRangeType.RANGE)
  @IsNotEmpty()
  @CustomIsISO9601DateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: 'Month (1-12) for MONTH type',
  })
  @Type(() => Number)
  @IsOptional()
  @CustomMin(1)
  @CustomMax(12)
  month?: number;

  @ApiPropertyOptional({
    description: 'Year for MONTH and YEAR types, eg : `2025`',
  })
  @CustomIsOptional()
  @Type(() => Number)
  @IsInt()
  @CustomMin(2000)
  @CustomMax(4000)
  year?: number;
}

export class YearAndMonthDateQueryDto {
  @ApiPropertyOptional({
    description: 'Type of date range',
    enum: YearAndMonthDateType,
  })
  @IsOptional()
  @IsEnum(YearAndMonthDateType)
  dateRangeType: YearAndMonthDateType;
}

// This query dto is specifically used in public user controller for events
export class DateRangeQueryWithIsFeaturedDto extends DateRangeQueryDto {
  @ApiProperty({
    required: false,
    type: 'number',
    description: 'Event host country Id',
    example: 236,
  })
  @CustomMin(1)
  @CustomTransformStringToNumber()
  @CustomIsNumber()
  @CustomIsOptional()
  countryId: number | undefined;

  // @ApiProperty({
  //   required: false,
  //   enum: EVENT_TYPES,
  //   description: 'Event type',
  //   example: EVENT_TYPES.PHYSICAL_EVENTS,
  // })
  // @CustomIsEnum(EVENT_TYPES)
  // @CustomIsOptional()
  // eventType: EVENT_TYPES | undefined;

  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'Filter records based on isFeatured field',
    example: true,
  })
  @CustomIsOptional()
  @CustomTransformStringToBoolean()
  isFeatured: boolean | undefined;
}

// This is to avoid breaking changes that can arise from API changes
export class DateRangeQueryWithIsActiveDto extends DateRangeQueryDto {
  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'Filter records based on isActive field',
    example: true,
  })
  @CustomIsOptional()
  @CustomTransformStringToBoolean()
  isActive: boolean | undefined;

  @ApiProperty({
    required: false,
    type: 'number',
    description: 'Event host country Id',
    example: 236,
  })
  @CustomMin(1)
  @CustomTransformStringToNumber()
  @CustomIsNumber()
  @CustomIsOptional()
  countryId: number | undefined;

  // @ApiProperty({
  //   required: false,
  //   enum: EVENT_TYPES,
  //   description: 'Event type',
  //   example: EVENT_TYPES.PHYSICAL_EVENTS,
  // })
  // @CustomIsEnum(EVENT_TYPES)
  // @CustomIsOptional()
  // eventType: EVENT_TYPES | undefined;

  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'Filter records based on isFeatured field',
    example: true,
  })
  @CustomIsOptional()
  @CustomTransformStringToBoolean()
  isFeatured: boolean | undefined;
}
