import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { ProductRatingEntity } from '../entities/product-rating.entity';

@Injectable()
export class ProductRatingRepository extends BaseRepository<ProductRatingEntity> {
  constructor(
    @InjectRepository(ProductRatingEntity)
    private repository: Repository<ProductRatingEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<ProductRatingEntity> {
    return this.repository;
  }
}
