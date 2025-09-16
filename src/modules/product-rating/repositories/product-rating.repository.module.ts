import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRatingEntity } from '../entities/product-rating.entity';
import { ProductRatingRepository } from './product-rating.repository';
  
@Module({
  providers: [ProductRatingRepository],
  exports: [ProductRatingRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([ProductRatingEntity])],
})
export class ProductRatingRepositoryModule {}
