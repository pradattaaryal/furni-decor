import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { BlogCategoryRepository } from './blog-category.repository';

@Module({
  providers: [BlogCategoryRepository],
  exports: [BlogCategoryRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([BlogCategoryEntity])],
})
export class BlogCategoryRepositoryModule {}
