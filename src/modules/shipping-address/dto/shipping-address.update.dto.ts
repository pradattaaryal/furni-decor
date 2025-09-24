import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateShippingAddressDto } from './shipping-address.create.dto';
import {
  CustomIsBoolean,
  CustomIsOptional,
} from 'src/common/request/validators/custom-validator';

export class ShippingAddressUpdateDto extends PartialType(
  CreateShippingAddressDto,
) {
  @ApiProperty({
    description: 'Defult shipping address',
    required: true,
    example: 'true',
  })
  @CustomIsBoolean()
  @CustomIsOptional()
  default: boolean;
}
