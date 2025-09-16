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
} from 'typeorm';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { IProductRatingEntity } from '../interfaces/product-rating.entity.interface';
   
@Entity({ name: 'product_ratings' })
export class ProductRatingEntity extends DatabaseBaseEntity implements IProductRatingEntity {
 
  @ManyToOne(() => ProductEntity, (product) => product.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.productRatings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'is_approved', type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'smallint', nullable: false })
  rating: number;
}
