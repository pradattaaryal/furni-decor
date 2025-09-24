import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { OrderEntity } from '../entities/order.entity';

@Module({
  providers: [OrderRepository],
  exports: [OrderRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([OrderEntity])],
})
export class OrderRepositoryModule {}
