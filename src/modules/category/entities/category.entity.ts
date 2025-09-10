import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ICategoryEntity } from '../interfaces/category.entity.interface';

export const CATEGORY_DATABASE_TABLE_NAME = 'categories';

@Entity({ name: CATEGORY_DATABASE_TABLE_NAME })
@Index(['name', 'parent_id'])
export class CategoryEntity extends DatabaseBaseEntity implements ICategoryEntity {
  // ======================
  // Columns===============
  // ======================

   
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

   
  @Column({ type: 'int', nullable: true })
  parent_id: number | null;

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
}
