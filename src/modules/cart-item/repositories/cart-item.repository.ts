import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { CartItemEntity } from '../entities/cart-item.entity';

@Injectable()
export class CartItemRepository extends BaseRepository<CartItemEntity> {
  constructor(
    @InjectRepository(CartItemEntity)
    private repository: Repository<CartItemEntity>,
  ) {
    super(repository);
  }
}
