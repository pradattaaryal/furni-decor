import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ICategoryEntity } from '../interfaces/category.entity.interface';

export const CATEGORY_DATABASE_TABLE_NAME = 'categories';

import slugify from 'slugify';
import { ProductEntity } from 'src/modules/products/entities/product.entity';

@Entity({ name: CATEGORY_DATABASE_TABLE_NAME })
@Index(['name', 'parent_id'])
export class CategoryEntity
  extends DatabaseBaseEntity
  implements ICategoryEntity
{
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'int', nullable: true })
  parent_id: number | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;
  // ======================
  // Relations=============
  // ======================

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: CategoryEntity | null;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children?: CategoryEntity[];

  // Products relationship - using forward reference to avoid circular dependency
  // @OneToMany('ProductEntity', 'category')
  // products?: any[];

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
  // ======================
  // Hooks =================
  // ======================
  @BeforeInsert()
  @BeforeUpdate()
  generateSlug(): void {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
  }
}
