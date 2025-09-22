 import { ApiProperty } from '@nestjs/swagger';
import { ICreateShippingAddress } from '../interfaces/shipping-address.create.dto.interface';
import { CustomIsBoolean, CustomIsOptional, CustomIsString } from 'src/common/request/validators/custom-validator';
 
export class CreateShippingAddressDto implements ICreateShippingAddress {
  @ApiProperty()
  @CustomIsString()
  addressLine1: string;

  @ApiProperty({ required: false })
  @CustomIsString()
  @CustomIsOptional()
  addressLine2?: string;

  @ApiProperty()
  @CustomIsString()
  city: string;

  @ApiProperty()
  @CustomIsString()
  state: string;

  @ApiProperty()
  @CustomIsString()
  postalCode: string;

  @ApiProperty()
  @CustomIsString()
  country: string;

  @ApiProperty({ default: false, description: 'Set as default address' })
  @CustomIsBoolean()
  @CustomIsOptional()
  default: boolean;
}
