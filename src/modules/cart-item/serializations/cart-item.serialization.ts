import { ApiProperty } from '@nestjs/swagger';

import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';
import { CartItemEntity } from '../entities/cart-item.entity';

export class CartItemSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: CartItemEntity,
  })
  data: CartItemEntity;
}

export class CartItemPaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [CartItemEntity],
  })
  data: CartItemEntity[];
}
