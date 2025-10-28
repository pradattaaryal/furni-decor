import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { ColorEntity } from 'src/modules/color/entities/color.entity';
import { WishlistEntity } from 'src/modules/wishlist/entities/wishlist.entity';

export const PRODUCT_VARIANT_DATABASE_TABLE_NAME = 'product_variants';

@Entity({ name: PRODUCT_VARIANT_DATABASE_TABLE_NAME })
@Index(['id'])
export class ProductVariantEntity extends DatabaseBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => ColorEntity, (color) => color.variants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'color_id' })
  color: ColorEntity | null;

  @OneToOne(() => ImageEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity | null;

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.variant)
  wishlists: WishlistEntity[];
}
