import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingAddressEntity } from '../entities/billing-address.entity';
import { BillingAddressRepository } from './billing-address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BillingAddressEntity])],
  providers: [BillingAddressRepository],
  exports: [BillingAddressRepository],
})
export class BillingAddressRepositoryModule {}
