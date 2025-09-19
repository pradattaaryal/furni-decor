import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { CartEntity } from '../entities/cart.entity';

@Injectable()
export class CartRepository extends BaseRepository<CartEntity> {
  constructor(
    @InjectRepository(CartEntity)
    private repository: Repository<CartEntity>,
  ) {
    super(repository);
  }
}
