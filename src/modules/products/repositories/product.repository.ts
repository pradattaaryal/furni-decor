import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<ProductEntity> {
    return this.repository;
  }

  async fetchProductByName(name: string): Promise<ProductEntity[]> {
    return await this.repository
      .createQueryBuilder('product')
      .where('product.name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async fetchProduct(id: number): Promise<ProductEntity | null> {
    return await this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id = :id', { id })
      .getOne();
  }

  async updateProduct(
    id: number,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity | null> {
    await this.repository.update(id, data);
    return await this.fetchProduct(id);
  }

  async getProductsByCategory(categoryId: number): Promise<ProductEntity[]> {
    return await this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.categoryId = :categoryId', { categoryId })
      .getMany();
  }
}
