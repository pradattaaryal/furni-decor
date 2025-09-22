import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateShippingAddress } from '../interfaces/shipping-address.create.dto.interface';

export class CreateShippingAddressDto implements ICreateShippingAddress {
  @ApiProperty()
  @IsString()
  addressLine1: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty({ default: false, description: 'Set as default address' })
  @IsBoolean()
  @IsOptional()
  default: boolean;
}
