import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { ProductVariantEntity } from 'src/modules/product-variants/entities/product-variant.entity';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';

export interface ICartItemEntity {
  id?: number;
  cartId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
  cart?: CartEntity;
  product?: ProductEntity;
  variant?: ProductVariantEntity;
}
