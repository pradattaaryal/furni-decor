import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryRepositoryModule } from './repositories/category.repository.module';
import { CategoryAdminController } from './controllers/category.admin.controller';
 import { CategoryEntity } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
 
@Module({
  providers: [
    CategoryService,
    
  ],

  exports: [CategoryService],
  controllers: [],
  imports: [CategoryRepositoryModule,TypeOrmModule.forFeature([CategoryEntity])],
})
export class CategoryModule {}
