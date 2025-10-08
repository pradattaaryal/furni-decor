import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { BlogEntity } from '../entities/blog.entity';

@Injectable()
export class BlogRepository extends BaseRepository<BlogEntity> {
  constructor(
    @InjectRepository(BlogEntity)
    private repository: Repository<BlogEntity>,
  ) {
    super(repository);
  }
}
