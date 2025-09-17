import { IProductEntity } from 'src/modules/products/interfaces/product.entity.interface';
import { IUserEntity } from 'src/modules/user/interfaces/user.entity.interface';

export interface IProductRatingCreateDto {
  productId: number;
  rating: number;
  parent_id?: number | null;
  comment?: string;
}
