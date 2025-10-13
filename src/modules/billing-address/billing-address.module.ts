import { Module } from '@nestjs/common';
import { BillingAddressRepositoryModule } from './repositories/billing-address.repository.module';
import { BillingAddressService } from './services/billing-address.service';
import { BillingAddressAdminController } from './controllers/billing-address.admin.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [BillingAddressRepositoryModule, UserModule],
  controllers: [BillingAddressAdminController],
  providers: [BillingAddressService],
  exports: [BillingAddressService, BillingAddressRepositoryModule],
})
export class BillingAddressModule {}
