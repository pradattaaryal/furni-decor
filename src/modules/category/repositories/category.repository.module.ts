import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryRepository } from './category.repository';

@Module({
  providers: [CategoryRepository],
  exports: [CategoryRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
})
export class CategoryRepositoryModule {}
