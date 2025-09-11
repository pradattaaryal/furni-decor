import { Module } from '@nestjs/common';
import { ProductRepositoryModule } from './repositories/product.repository.module';
import { ProductService } from './services/product.service';

@Module({
  imports: [ProductRepositoryModule],
  controllers: [],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
