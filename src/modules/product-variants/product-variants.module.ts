import { Module } from '@nestjs/common';
import { ProductVariantRepositoryModule } from './repositories/product-variant.repository.module';
import { ProductVariantService } from './services/product-variant.service';
import { ImageRepositoryModule } from '../image/repositories/image.repository.module';
import { ImageModule } from '../image/image.module';
import { ProductRepositoryModule } from '../products/repositories/product.repository.module';
import { ColorRepositoryModule } from '../color/repositories/color.repository.module';

@Module({
  imports: [
    ProductVariantRepositoryModule,
    ImageRepositoryModule,
    ImageModule,
    ProductRepositoryModule,
    ColorRepositoryModule,
  ],
  providers: [ProductVariantService],
  exports: [ProductVariantService, ProductVariantRepositoryModule],
  controllers: [],
})
export class ProductVariantsModule {}
