import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';

import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { ProductVariantEntity } from 'src/modules/product-variants/entities/product-variant.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@Entity({ name: 'order_items' })
export class OrderItemEntity extends DatabaseBaseEntity {
  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @Column({ name: 'variant_id', nullable: true })
  variantId?: number;

  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  price: number; // Store item price at the time of order

  // ========== RELATIONS ==========
  @ManyToOne(() => OrderEntity, (order) => order.items, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  // Variant relation + foreign key
  @ManyToOne(() => ProductVariantEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariantEntity;

  // Product relation + foreign key
  @ManyToOne(() => ProductEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
