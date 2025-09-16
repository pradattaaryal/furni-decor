import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<CategoryEntity> {
    return this.repository;
  }

  async fetchCategoryByName(slug: string): Promise<CategoryEntity[]> {
    return this._findAll({
      options: {
        where: { name: slug },
        relations: ['children'],
        order: { name: 'ASC' },
      },
    });
  }

  async fetchCategory(id: number): Promise<CategoryEntity | null> {
    return this._findOneById(id, {
      options: {
        relations: ['children'],
      },
    });
  }

  async updateCategory(
    id: number,
    data: Partial<CategoryEntity>,
  ): Promise<CategoryEntity | null> {
    const result = await this._findOneById(id);
    if (!result) return null;

    const updatedResult = await this._update({
      ...result,
      ...data,
    } as CategoryEntity);
    return updatedResult;
  }
}
