import { Module } from '@nestjs/common';
import { ProductRepositoryModule } from './repositories/product.repository.module';
import { ProductService } from './services/product.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [ProductRepositoryModule,CategoryModule],
  controllers: [],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
