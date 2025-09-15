import { Module } from '@nestjs/common';
import { ProductVariantRepositoryModule } from './repositories/product-variant.repository.module';
import { ProductVariantService } from './services/product-variant.service';

@Module({
  imports: [ProductVariantRepositoryModule],
  providers: [ProductVariantService],
  exports: [ProductVariantService],
  controllers: [],
})
export class ProductVariantsModule {} 