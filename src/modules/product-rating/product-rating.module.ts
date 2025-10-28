import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRatingRepositoryModule } from './repositories/product-rating.repository.module';
import { ProductRatingEntity } from './entities/product-rating.entity';
import { ProductRatingService } from './services/product-rating.service';
import { ProductRatingAdminController } from './controllers/product-rating.admin.controller';
import { ProductRepositoryModule } from '../products/repositories/product.repository.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    ProductRatingRepositoryModule,
    ProductRepositoryModule,
    ProductsModule,
    TypeOrmModule.forFeature([ProductRatingEntity]),
  ],
  providers: [ProductRatingService],
  exports: [ProductRatingService],
})
export class ProductRatingModule {}
