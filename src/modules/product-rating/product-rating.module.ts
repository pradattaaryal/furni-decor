import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRatingRepositoryModule } from './repositories/product-rating.repository.module';
import { ProductRatingEntity } from './entities/product-rating.entity';
import { ProductRatingService } from './services/product-rating.service';
import { ProductsModule } from '../products/products.module';
import { ProductService } from '../products/services/product.service';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { ProductVariantService } from '../product-variants/services/product-variant.service';
import { ProductRepositoryModule } from '../products/repositories/product.repository.module';
import { ImageRepositoryModule } from '../image/repositories/image.repository.module';

@Module({
  imports: [
    ProductsModule,
    ProductVariantsModule,
    ProductRepositoryModule,
    ProductRatingRepositoryModule,
    TypeOrmModule.forFeature([ProductRatingEntity]),
  ],
  providers: [ProductRatingService],
  exports: [ProductRatingService],
  controllers: [],
})
export class ProductRatingModule {}
