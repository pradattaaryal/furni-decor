import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { ProductVariantEntity } from '../entities/product-variant.entity';

@Injectable()
export class ProductVariantRepository extends BaseRepository<ProductVariantEntity> {
  constructor(
    @InjectRepository(ProductVariantEntity)
    private repository: Repository<ProductVariantEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<ProductVariantEntity> {
    return this.repository;
  }
}
