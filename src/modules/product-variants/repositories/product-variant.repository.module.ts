import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductVariantRepository } from './product-variant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantEntity])],
  providers: [ProductVariantRepository],
  exports: [ProductVariantRepository],
})
export class ProductVariantRepositoryModule {}
