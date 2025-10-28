// products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductRepositoryModule } from './repositories/product.repository.module';
import { ProductService } from './services/product.service';
import { CategoryModule } from '../category/category.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { ImageModule } from '../image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from '../color/entities/color.entity';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { KeyValueModule } from 'src/common/key-value/key-value.module';
import { ProductCacheService } from './services/product-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ColorEntity, ProductEntity, CategoryEntity]),
    ProductRepositoryModule,
    CategoryModule,
    ProductVariantsModule,
    ImageModule,
    KeyValueModule.forRoot({ useRedis: true }),
  ],
  providers: [ProductService, ProductCacheService],
  exports: [ProductService, ProductCacheService],
})
export class ProductsModule {}
