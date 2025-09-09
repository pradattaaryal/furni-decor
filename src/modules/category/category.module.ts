import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryRepositoryModule } from './repositories/category.repository.module';
import { CategoryAdminController } from './controllers/category.admin.controller';
import { CategorySeederService } from './providers/category.seeder';
import { CategoryIdValidation, CategoryNameValidation } from './validations';

@Module({
  providers: [
    CategoryService,
    CategorySeederService,
    CategoryIdValidation,
    CategoryNameValidation,
  ],
  exports: [CategoryService],
  controllers: [CategoryAdminController],
  imports: [CategoryRepositoryModule],
})
export class CategoryModule {}
