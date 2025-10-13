import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@Entity({ name: 'billing_addresses' })
export class BillingAddressEntity extends DatabaseBaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 255 })
  streetAddress1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  streetAddress2?: string;

  @Column({ type: 'varchar', length: 20 })
  zipCode: string;

  @Column({ type: 'boolean', default: false })
  default: boolean;

  /////////////////relation/////////////////////

  @ManyToOne(() => UserEntity, (user) => user.billingAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderEntity, (order) => order.billingAddress)
  orders: OrderEntity[];
}
