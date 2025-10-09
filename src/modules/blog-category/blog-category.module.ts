import { Module } from '@nestjs/common';
import { BlogCategoryService } from './services/blog-category.service';
import { BlogCategoryRepositoryModule } from './repositories/blog-category.repository.module';
import { BlogCategoryAdminController } from './controllers/blog-category.admin.controller';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [BlogCategoryService],
  exports: [BlogCategoryService],
  controllers: [],
  imports: [
    BlogCategoryRepositoryModule,
    TypeOrmModule.forFeature([BlogCategoryEntity]),
  ],
})
export class BlogCategoryModule {}
