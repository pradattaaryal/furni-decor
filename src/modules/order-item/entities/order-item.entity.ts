import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@Entity({ name: 'order_items' })
export class OrderItemEntity extends DatabaseBaseEntity {
  @Column({ name: 'order_id', type: 'int', nullable: false })
  orderId: number;

  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId: number;

  @Column({ name: 'variant_id', type: 'int', nullable: true })
  variantId?: number;

  @Column({ name: 'product_name', type: 'varchar', nullable: false })
  productName: string;

  @Column({ name: 'product_color', type: 'varchar', nullable: false })
  color: string;

  @Column({ name: 'model', type: 'varchar', nullable: false })
  model: string;

  @Column({ type: 'jsonb', nullable: false, default: '{}' })
  dimensions: Record<string, any>;

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
  price: number;

  @Column({
    name: 'warranty_summary',
    type: 'text',
    nullable: true,
    default: '',
  })
  warrantySummary?: string;

  @Column({
    name: 'warranty_service_type',
    type: 'text',
    nullable: true,
    default: '',
  })
  warrantyServiceType?: string;

  @Column({
    name: 'covered_in_warranty',
    type: 'text',
    nullable: true,
    default: '',
  })
  coveredInWarranty?: string;

  @Column({
    name: 'not_covered_in_warranty',
    type: 'text',
    nullable: true,
    default: '',
  })
  notCoveredInWarranty?: string;

  @Column({
    name: 'domestic_warranty',
    type: 'text',
    nullable: true,
    default: '',
  })
  domesticWarranty?: string;

  // ====== Images ======
  // ====== Images ======
  @ManyToOne(() => ImageEntity, {
    cascade: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'product_image_id' })
  productImage: ImageEntity | null;

  @ManyToOne(() => ImageEntity, {
    cascade: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'varient_image_id' })
  varientImage: ImageEntity | null;

  // ====== Relations ======
  @ManyToOne(() => OrderEntity, (order) => order.items, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
