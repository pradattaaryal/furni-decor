import { IProductEntity } from 'src/modules/products/interfaces/product.entity.interface';
import { IUserEntity } from 'src/modules/user/interfaces/user.entity.interface';

export interface IProductRatingCreateDto {
  product: IProductEntity;
  user: IUserEntity;
  isApproved: boolean;
  rating: number;
}
