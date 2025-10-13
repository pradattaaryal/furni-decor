import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 import { BillingAddressEntity } from '../entities/billing-address.entity';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';

@Injectable()
export class BillingAddressRepository extends BaseRepository<BillingAddressEntity> {
  constructor(
    @InjectRepository(BillingAddressEntity)
    private repository: Repository<BillingAddressEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<BillingAddressEntity> {
    return this.repository;
  }
}
