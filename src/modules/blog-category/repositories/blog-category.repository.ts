import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { BlogCategoryEntity } from '../entities/blog-category.entity';

@Injectable()
export class BlogCategoryRepository extends BaseRepository<BlogCategoryEntity> {
  constructor(
    @InjectRepository(BlogCategoryEntity)
    private repository: Repository<BlogCategoryEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<BlogCategoryEntity> {
    return this.repository;
  }
}
