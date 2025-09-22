import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { ProductVariantEntity } from 'src/modules/product-variants/entities/product-variant.entity';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { ICartItemEntity } from '../interfaces/cart-item.entity.interface';

@Entity({ name: 'cart_items' })
export class CartItemEntity
  extends DatabaseBaseEntity
  implements ICartItemEntity
{
  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @Column({ name: 'cart_id' })
  cartId: number;

  // Product relation + foreign key
  @ManyToOne(() => ProductEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  // Variant relation + foreign key
  @ManyToOne(() => ProductVariantEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariantEntity;

  @Column({ name: 'variant_id', nullable: true })
  variantId?: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
