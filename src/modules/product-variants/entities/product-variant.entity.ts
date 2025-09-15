import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from 'src/modules/products/entities/product.entity';

export const PRODUCT_VARIANT_DATABASE_TABLE_NAME = 'product_variants';

@Entity({ name: PRODUCT_VARIANT_DATABASE_TABLE_NAME })
@Index(['id'])
export class ProductVariantEntity extends DatabaseBaseEntity {
  @Column({ type: 'jsonb' })
  dimensions: Record<string, any>;

  @Column({ type: 'varchar', length: 20 })
  color: string;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
} 