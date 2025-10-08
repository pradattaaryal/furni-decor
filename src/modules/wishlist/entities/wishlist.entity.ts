import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';

@Entity({ name: 'wishlists' })
export class WishlistEntity extends DatabaseBaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => UserEntity, (user) => user.wishlists, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.wishlists, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
