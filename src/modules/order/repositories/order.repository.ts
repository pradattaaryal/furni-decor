import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends BaseRepository<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private repository: Repository<OrderEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<OrderEntity> {
    return this.repository;
  }
}
