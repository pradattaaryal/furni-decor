import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CartItemEntity } from 'src/modules/cart-item/entities/cart-item.entity';

export const CART_DATABASE_TABLE_NAME = 'cart';

@Entity({ name: CART_DATABASE_TABLE_NAME })
export class CartEntity extends DatabaseBaseEntity {
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

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
  // ========== RELATIONS ==========

  @OneToOne(() => UserEntity, (user) => user.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (item) => item.cart, {
    cascade: true,
  })
  items: CartItemEntity[];
}
