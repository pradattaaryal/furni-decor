import { ApiProperty } from '@nestjs/swagger';
import { ICreateShippingAddress } from '../interfaces/shipping-address.create.dto.interface';
import {
  CustomIsBoolean,
  CustomIsOptional,
  CustomIsString,
} from 'src/common/request/validators/custom-validator';

export class CreateShippingAddressDto implements ICreateShippingAddress {
  @ApiProperty({
    description: 'Address 1',
    required: false,
    example: 'Kathmandu 10 kalimandir',
  })
  @ApiProperty()
  @CustomIsString()
  addressLine1: string;

  @ApiProperty({
    description: 'Address 2',
    required: true,
    example: 'paokara 11 Rammandir',
  })
  @CustomIsString()
  @CustomIsOptional()
  addressLine2?: string;

  @ApiProperty({
    description: 'City',
    required: true,
    example: 'Pokhara',
  })
  @CustomIsString()
  city: string;

  @ApiProperty({
    description: 'State',
    required: true,
    example: 'Bagmati',
  })
  @CustomIsString()
  state: string;

  @ApiProperty({
    description: 'Postalcode',
    required: true,
    example: '445A81',
  })
  @CustomIsString()
  postalCode: string;

  @ApiProperty({
    description: 'Country',
    required: true,
    example: 'Nepal',
  })
  @CustomIsString()
  country: string;

  @ApiProperty({
    description: 'Defult shipping address',
    required: true,
    example: 'true',
  })
  @CustomIsBoolean()
  @CustomIsOptional()
  default: boolean;
}
