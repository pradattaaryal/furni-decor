 
import { Module } from '@nestjs/common';
 import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRatingRepositoryModule } from './repositories/category.repository.module';
import { ProductRatingEntity } from './entities/product-rating.entity';
import { ProductRatingService } from './services/product-rating.service';
import { ProductsModule } from '../products/products.module';
import { ProductService } from '../products/services/product.service';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { ProductVariantService } from '../product-variants/services/product-variant.service';

@Module({
  imports: [
    ProductsModule,  
    ProductVariantsModule,
    ProductRatingRepositoryModule,
    TypeOrmModule.forFeature([ProductRatingEntity]),
  ],
  providers: [ProductRatingService, ProductService, ProductVariantService],
  exports: [ProductRatingService],
  controllers: [],
})
export class ProductRatingModule {}
