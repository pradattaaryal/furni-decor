import { USERS_DATABASE_TABLE_NAME } from 'src/modules/user/entities/user.entity';
import { PRODUCT_VARIANT_DATABASE_TABLE_NAME } from 'src/modules/product-variants/entities/product-variant.entity';
import { PRODUCT_DATABASE_TABLE_NAME } from 'src/modules/products/entities/product.entity';
import { HOME_PAGE_BANNER_DATABASE_TABLE_NAME } from 'src/modules/home-page-banner/entities/home-page-banner.entity';

export enum FILE_ASSOCIATION_TYPE {
  USER = USERS_DATABASE_TABLE_NAME,
  PRODUCT_VARIANT = PRODUCT_VARIANT_DATABASE_TABLE_NAME,
  PRODUCT_IMAGE = PRODUCT_DATABASE_TABLE_NAME,
  PRODUCT_BANNER=HOME_PAGE_BANNER_DATABASE_TABLE_NAME,
}
