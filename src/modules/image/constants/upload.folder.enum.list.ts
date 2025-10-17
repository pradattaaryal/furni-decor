import { USERS_DATABASE_TABLE_NAME } from 'src/modules/user/entities/user.entity';
import { PRODUCT_VARIANT_DATABASE_TABLE_NAME } from 'src/modules/product-variants/entities/product-variant.entity';
import { PRODUCT_DATABASE_TABLE_NAME } from 'src/modules/products/entities/product.entity';

export enum UPLOAD_FOLDER_ENUM {
  USER = USERS_DATABASE_TABLE_NAME,
  PRODUCT_VARIANT = PRODUCT_VARIANT_DATABASE_TABLE_NAME,
  PRODUCT_IMAGE = PRODUCT_DATABASE_TABLE_NAME,
}
