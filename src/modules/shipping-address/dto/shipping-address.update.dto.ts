import { PartialType } from '@nestjs/swagger';
import { CreateShippingAddressDto } from './shipping-address.create.dto';

export class ShippingAddressUpdateDto extends PartialType(
  CreateShippingAddressDto,
) {}
