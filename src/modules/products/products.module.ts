import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { ProductRepositoryModule } from './repositories/product.repository.module';
import { ProductService } from './services/product.service';

@Module({
  imports: [ProductRepositoryModule,CategoryModule,ProductVariantsModule],
  controllers: [],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
