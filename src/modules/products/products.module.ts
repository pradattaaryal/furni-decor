// products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductRepositoryModule } from './repositories/product.repository.module';
import { ProductService } from './services/product.service';
import { CategoryModule } from '../category/category.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    ProductRepositoryModule,
    CategoryModule,
    ProductVariantsModule,
    ImageModule,
  ],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
