import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartItemRepository } from './cart-item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity])],
  providers: [CartItemRepository],
  exports: [CartItemRepository],
})
export class CartItemRepositoryModule {}
