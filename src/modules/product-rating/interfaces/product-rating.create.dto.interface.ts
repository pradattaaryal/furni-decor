import { RATING_VALUE } from '../constants/product-rating.constant';

export interface IProductRatingCreateDto {
  productId: number;
  rating: RATING_VALUE;
}
