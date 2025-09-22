import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddressEntity } from './entities/shipping-address.entity';
import { ShippingAddressRepositoryModule } from './repositories/shipping-address.repository.module';
import { ShippingAddressService } from './services/shipping-address.service';

@Module({
  providers: [ShippingAddressService],
  exports: [ShippingAddressService],
  controllers: [],
  imports: [
    ShippingAddressRepositoryModule,
    TypeOrmModule.forFeature([ShippingAddressEntity]),
  ],
})
export class ShippingAddressModule {}
