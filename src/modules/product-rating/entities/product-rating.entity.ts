import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { IProductRatingEntity } from '../interfaces/product-rating.entity.interface';
import {
  PRODUCT_RATING_DATABASE_TABLE_NAME,
  RATING_VALUE,
} from '../constants/product-rating.constant';

@Entity({ name: PRODUCT_RATING_DATABASE_TABLE_NAME })
@Unique('unique_user_product_rating', ['productId', 'userId'])
@Index(['productId', 'userId'])
export class ProductRatingEntity
  extends DatabaseBaseEntity
  implements IProductRatingEntity
{
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'int',
    enum: RATING_VALUE,
    comment: 'Rating value from 1 to 5',
  })
  rating: RATING_VALUE;

  // Relations
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
}
