import { ApiProperty } from '@nestjs/swagger';
import { CartEntity } from '../entities/cart.entity';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';

export class CartSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: CartEntity,
  })
  data: CartEntity;
}

export class CartPaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [CartEntity],
  })
  data: CartEntity[];
}
