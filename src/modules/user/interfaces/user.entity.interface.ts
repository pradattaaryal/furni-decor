import { IBaseUserEntity } from 'src/common/database/interfaces/user.base.interface';
import { IProductRatingEntity } from 'src/modules/product-rating/interfaces/product-rating.entity.interface';

export interface IUserEntity extends IBaseUserEntity {
  firstName: string | null;
  lastName: string | null;

  productRatings: IProductRatingEntity[];

  // Optional relation to image (future-proofing)
  // image?: IImageEntity | null;
}
