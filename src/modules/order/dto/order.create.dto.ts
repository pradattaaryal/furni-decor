import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
} from 'src/common/request/validators/custom-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto extends DatabaseBaseEntity {
  @ApiProperty({
    description: 'Cart Id for order',
    example: '1',
    required: true,
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  CartId: number;

  @ApiProperty({
    description: 'Shipping Address for order',
    example: '1',
    required: true,
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  shippingAddress: number;
}
