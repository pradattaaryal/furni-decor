import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@Entity({ name: 'shipping_addresses' })
export class ShippingAddressEntity extends DatabaseBaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  addressLine1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  addressLine2?: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 20 })
  postalCode: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'boolean', default: false })
  default: boolean;

  /////////////////relation/////////////////////

  @ManyToOne(() => UserEntity, (user) => user.shippingAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // shipping-address.entity.ts
  @OneToMany(() => OrderEntity, (order) => order.shippingAddress)
  orders: OrderEntity[];
}
