import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemRepository } from './order-item.repository';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';

@Module({
  providers: [OrderItemRepository],
  exports: [OrderItemRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([OrderItemEntity])],
})
export class OrderItemRepositoryModule {}
