import { ApiProperty } from '@nestjs/swagger';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';
import { CategoryEntity } from '../entities/category.entity';

export class CategorySerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: CategoryEntity,
  })
  data: CategoryEntity;
}

export class CategoryPaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [CategoryEntity],
  })
  data: CategoryEntity[];
}
