import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { Expose } from 'class-transformer';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ImageEntity } from 'src/modules/image/entities/image.entity';

export const PRODUCT_VARIANT_DATABASE_TABLE_NAME = 'product_variants';

@Entity({ name: PRODUCT_VARIANT_DATABASE_TABLE_NAME })
@Index(['id'])
export class ProductVariantEntity extends DatabaseBaseEntity {
  @Column({ type: 'jsonb', nullable: false })
  dimensions: Record<number, any>;

  @Column({ type: 'varchar', length: 20, nullable: false })
  color: string;

  @Column({ type: 'int', nullable: true })
   quantity: number | null;

  @OneToOne(() => ImageEntity, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity | null;

  // @Column({ name: 'product_id', type: 'int' })
  // productId: number;

  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
