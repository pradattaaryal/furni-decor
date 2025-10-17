import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { RATING_VALUE } from '../constants/product-rating.constant';

export interface IProductRatingEntity {
  productId: number;
  userId: number;
  rating: RATING_VALUE;
}
