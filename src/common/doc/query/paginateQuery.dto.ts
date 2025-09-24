import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { SORT_ORDER_ENUM } from 'src/common/database/interfaces/findOption.interface';
import {
  CustomIsEnum,
  CustomIsNumber,
  CustomIsOptional,
  CustomMin,
  CustomTransformStringToBoolean,
  CustomTransformStringToNumber,
} from 'src/common/request/validators/custom-validator';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

/**
 * Specifies what columns should be retrieved.
 */

/**
 * Indicates what relations of entity should be loaded (simplified left join form).
 */
export class OptionsRelations<T = any> {
  @ApiPropertyOptional()
  @IsOptional()
  readonly relations?: FindOptionsRelations<T>;
}

export class OptionParams<T> extends OptionsRelations<T> {
  /**
   * Order, in which entities should be ordered.
   */
  @ApiPropertyOptional()
  @IsOptional()
  readonly order: FindOptionsOrder<T>;

  /**
   * Simple condition that should be applied to match entities.
   */
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  readonly where: FindOptionsWhere<T>;

  /**
   * Indicates if soft-deleted rows should be included in entity result.
   */
  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    value ? (value === 'true' ? true : false) : false,
  )
  readonly withDeleted: boolean;
}

export class SortBy {
  @ApiProperty()
  @IsString()
  field: string;

  @ApiProperty({
    enum: ['asc', 'desc'],
  })
  @CustomIsEnum(['asc', 'desc'])
  order: 'asc' | 'desc';
}

export class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  value: string | string[];
}

export class PaginateQueryDto {
  @ApiPropertyOptional({
    type: () => 'number',
    minimum: 1,
    maximum: 100,
    description: 'max value is 100, default value is 20',
  })
  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform((params: TransformFnParams) =>
    params?.value ? parseInt(params.value, 10) : 10,
  )
  limit: number;

  @ApiPropertyOptional({ type: () => 'number', minimum: 1 })
  @IsOptional()
  @Min(1)
  @Transform((params: TransformFnParams) =>
    params?.value ? parseInt(params.value, 10) : 1,
  )
  page: number;

  @ApiPropertyOptional({ enum: SORT_ORDER_ENUM })
  @IsOptional()
  @CustomIsEnum(SORT_ORDER_ENUM)
  sortOrder: SORT_ORDER_ENUM;

  @ApiPropertyOptional({
    type: 'string',
    description:
      'Name of property through which sorting should be performed eg: `id` or `createdAt`, If property is not eligible for sorting it will ignore sorting',
  })
  @IsOptional()
  @IsString()
  sortBy: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'can be "key1,key2" or just "key"',
  })
  @IsOptional()
  @IsString()
  searchBy: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsString()
  search: string;

  @ApiPropertyOptional({ type: 'string', enum: ['true', 'false'] })
  @IsOptional()
  @Transform((params: TransformFnParams) => {
    return params?.value === 'true' || params?.value === true ? true : false;
  })
  withDeleted: boolean;
}
export class PaginateQueryWithSkipDto extends PaginateQueryDto {
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Skip pagination and get all item available',
  })
  @CustomIsOptional()
  @CustomTransformStringToBoolean()
  skipPagination: boolean | undefined;
}

export class PaginateQueryIsActiveWithSkipDto extends PaginateQueryWithSkipDto {
  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'Filter records based on isActive field',
  })
  @CustomIsOptional()
  @CustomTransformStringToBoolean()
  isActive: boolean | undefined;
}

export class ProductPaginateQueryDto extends PaginateQueryDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Minimum price filter',
  })
  @CustomIsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  minPrice?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Maximum price filter',
  })
  @CustomIsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  maxPrice?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Category ID filter',
  })
  @CustomIsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  categoryId?: number;

  @ApiPropertyOptional({ type: String, description: 'Variant color filter' })
  @CustomIsOptional()
  color?: string;
}

export class QuestionsPaginateQueryWithSkipDto extends PaginateQueryWithSkipDto {
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Filter records based on isMandatory field',
  })
  @CustomIsOptional()
  @CustomTransformStringToBoolean()
  isMandatory: boolean | undefined;
}

export class PartnersQueryDto extends PaginateQueryWithSkipDto {
  @ApiProperty({
    required: false,
    type: 'number',
    example: 236,
  })
  @CustomIsOptional()
  @CustomTransformStringToNumber()
  @CustomIsNumber()
  @CustomMin(1)
  countryId: number;
}
