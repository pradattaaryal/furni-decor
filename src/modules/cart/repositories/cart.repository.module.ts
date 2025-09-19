import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../entities/cart.entity';
import { CartRepository } from './cart.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity])],
  providers: [CartRepository],
  exports: [CartRepository],
})
export class CartRepositoryModule {}
