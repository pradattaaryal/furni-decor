import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { Expose } from 'class-transformer';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';

export const PRODUCT_VARIANT_DATABASE_TABLE_NAME = 'product_variants';

@Entity({ name: PRODUCT_VARIANT_DATABASE_TABLE_NAME })
@Index(['id'])
export class ProductVariantEntity extends DatabaseBaseEntity {
  @Column({ type: 'jsonb', nullable: false })
  dimensions: Record<string, any>;

  @Column({ type: 'varchar', length: 20, nullable: false })
  color: string;

  @Column({ type: 'int', nullable: true })
  count: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => ( parseFloat(value) ),
    },
  })
  price: number  ;

  @Column({ name: 'image_id', type: 'int', nullable: true })
  imageId: number | null;

  // @Column({ name: 'product_id', type: 'int' })
  // productId: number;

  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
