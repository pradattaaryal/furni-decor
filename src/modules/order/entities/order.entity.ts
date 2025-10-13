import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { OrderItemEntity } from 'src/modules/order-item/entities/order-item.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ORDER_STATUS } from '../constant/order.constant';
import { Expose } from 'class-transformer';
import { ShippingAddressEntity } from 'src/modules/shipping-address/entities/shipping-address.entity';
import { BillingAddressEntity } from 'src/modules/billing-address/entities/billing-address.entity';

export const ORDER_DATABASE_TABLE_NAME = 'orders';

@Entity({ name: ORDER_DATABASE_TABLE_NAME })
export class OrderEntity extends DatabaseBaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: ORDER_STATUS,
    default: ORDER_STATUS.ORDER_PENDING,
  })
  status: ORDER_STATUS;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    createForeignKeyConstraints: false,
    cascade: true,
    nullable: true,
  })
  items: OrderItemEntity[];

  @ManyToOne(() => ShippingAddressEntity, (address) => address.orders, {
    cascade: false,
    eager: true,
  })
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: ShippingAddressEntity;

  @ManyToOne(() => BillingAddressEntity, (address) => address.orders, {
    cascade: false,
    eager: true,
  })
  @JoinColumn({ name: 'billing_address_id' })
  billingAddress: BillingAddressEntity;
}
