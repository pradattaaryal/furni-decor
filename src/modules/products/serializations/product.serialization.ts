import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';

export class ProductSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: ProductEntity,
  })
  data: ProductEntity;
}

export class ProductPaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [ProductEntity],
  })
  data: ProductEntity[];
}
