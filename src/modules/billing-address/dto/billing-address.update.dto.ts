import { PartialType } from '@nestjs/swagger';
import { CreateBillingAddressDto } from './billing-address.create.dto';

export class UpdateBillingAddressDto extends PartialType(
  CreateBillingAddressDto,
) {}
