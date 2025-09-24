import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { OrderItemEntity } from '../entities/order-item.entity';

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItemEntity> {
  constructor(
    @InjectRepository(OrderItemEntity)
    private repository: Repository<OrderItemEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<OrderItemEntity> {
    return this.repository;
  }
}
