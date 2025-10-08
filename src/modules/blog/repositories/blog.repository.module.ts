import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogEntity } from '../entities/blog.entity';
import { BlogRepository } from './blog.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [BlogRepository],
  exports: [BlogRepository],
})
export class BlogRepositoryModule {}
