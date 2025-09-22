import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { ShippingAddressEntity } from '../entities/shipping-address.entity';

@Injectable()
export class ShippingAddressRepository extends BaseRepository<ShippingAddressEntity> {
  constructor(
    @InjectRepository(ShippingAddressEntity)
    private repository: Repository<ShippingAddressEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<ShippingAddressEntity> {
    return this.repository;
  }
}
