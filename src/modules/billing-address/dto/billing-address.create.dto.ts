import { ApiProperty } from '@nestjs/swagger';
import { ICreateBillingAddress } from '../interfaces/billing-address.create.dto.interface';
import {
  CustomIsBoolean,
  CustomIsEmail,
  CustomIsNotEmpty,
  CustomIsOptional,
  CustomIsString,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';

export class CreateBillingAddressDto implements ICreateBillingAddress {
  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    required: true,
  })
  @CustomIsEmail()
  @CustomIsNotEmpty()
  @CustomMaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(20)
  phoneNumber: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Main Street',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(255)
  address: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(100)
  city: string;

  @ApiProperty({
    description: 'Country',
    example: 'United States',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(100)
  country: string;

  @ApiProperty({
    description: 'State/Province',
    example: 'New York',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(100)
  state: string;

  @ApiProperty({
    description: 'Street Address 1',
    example: '123 Main Street',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(255)
  streetAddress1: string;

  @ApiProperty({
    description: 'Street Address 2',
    example: 'Apt 4B',
    required: false,
  })
  @CustomIsString()
  @CustomIsOptional()
  @CustomMaxLength(255)
  streetAddress2?: string;

  @ApiProperty({
    description: 'ZIP/Postal Code',
    example: '10001',
    required: true,
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  @CustomMaxLength(20)
  zipCode: string;

  @ApiProperty({
    description: 'Default billing address',
    example: true,
    required: false,
  })
  @CustomIsBoolean()
  @CustomIsOptional()
  default: boolean;
}
