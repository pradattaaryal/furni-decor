import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantRepositoryModule } from './repositories/product-variant.repository.module';
import { ProductVariantService } from './services/product-variant.service';
import { ProductService } from '../products/services/product.service';
import { ProductRepositoryModule } from '../products/repositories/product.repository.module';

@Module({
  imports: [ProductVariantRepositoryModule, ProductRepositoryModule],
  providers: [ProductVariantService, ProductService],
  exports: [ProductVariantService],
  controllers: [],
})
export class ProductVariantsModule {} 