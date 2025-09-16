// src/modules/product-rating/entities/product-rating.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { IProductRatingEntity } from '../interfaces/product-rating.entity.interface';

@Entity({ name: 'product_ratings' })
export class ProductRatingEntity
  extends DatabaseBaseEntity
  implements IProductRatingEntity
{
  @Column({ name: 'is_approved', type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'smallint', nullable: false })
  rating: number;

  // @Column({ type: 'int', nullable: true })
  // parent_id: number | null;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;
  // ======================
  // Relations=============
  // ======================

  @ManyToOne(() => ProductEntity, (product) => product.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.productRatings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @ManyToOne(
    () => ProductRatingEntity,
    (productrating) => productrating.children,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'parent_id' })
  parent?: ProductRatingEntity | null;

  @OneToMany(() => ProductRatingEntity, (productrating) => productrating.parent)
  children?: ProductRatingEntity[];
}
