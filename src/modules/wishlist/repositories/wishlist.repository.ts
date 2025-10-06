import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistEntity } from '../entities/wishlist.entity';

@Injectable()
export class WishlistRepository extends BaseRepository<WishlistEntity> {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly _wishlistRepo: Repository<WishlistEntity>,
  ) {
    super(_wishlistRepo);
  }
}
