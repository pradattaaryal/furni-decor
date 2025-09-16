import { IProductEntity } from 'src/modules/products/interfaces/product.entity.interface';
import { IUserEntity } from 'src/modules/user/interfaces/user.entity.interface';

export interface IProductRatingCreateDto {
  productId: number;
  userId: string;
  isApproved: boolean;
  rating: number;
  parent_id?: number;
  comment?: string;
}
