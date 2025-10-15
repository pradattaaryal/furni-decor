import { Exclude, Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  ADMIN_ONLY_GROUP,
  ALL_GROUP,
} from 'src/common/database/constant/serialization-group.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { FILE_ASSOCIATION_TYPE } from '../constants/association-type.enum';
import { IImageInterface } from '../interfaces/image.interfaces';
import { ProductVariantEntity } from 'src/modules/product-variants/entities/product-variant.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';

export const IMAGE_TABLE_NAME = 'image';

@Index(['type', 'deletedAt'], {
  where: "type = 'product_variants' AND deleted_at IS NULL",
})
@Entity({ name: IMAGE_TABLE_NAME })
export class ImageEntity extends DatabaseBaseEntity implements IImageInterface {
  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;
  
  @Column({ type: 'varchar', length: 50 })
  mime: string;
  @Exclude()
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: new BigIntTransformerPipe(),
  })
  size?: number;
  @Exclude()
  @Index()
  @Column({
    type: 'varchar',
    length: 100,
    name: 'type',
    nullable: true,
  })
  type?: string | null;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.image, {
    cascade: false,
  })
  blogs: BlogEntity[];
}
