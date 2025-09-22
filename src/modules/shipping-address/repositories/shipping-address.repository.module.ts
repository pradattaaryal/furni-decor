import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddressRepository } from './shipping-address.repository';
import { ShippingAddressEntity } from '../entities/shipping-address.entity';

@Module({
  providers: [ShippingAddressRepository],
  exports: [ShippingAddressRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([ShippingAddressEntity])],
})
export class ShippingAddressRepositoryModule {}
