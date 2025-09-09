import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ICategoryEntity } from '../interfaces/category.entity.interface';

export const CATEGORY_DATABASE_TABLE_NAME = 'categories';

@Entity({ name: CATEGORY_DATABASE_TABLE_NAME })
@Index(['name', 'parent_id'])
export class CategoryEntity extends DatabaseBaseEntity implements ICategoryEntity {
  // ======================
  // Columns===============
  // ======================

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'int', nullable: true })
  parent_id: number | null;

  // ======================
  // Relations=============
  // ======================

  @Expose({ groups: ALL_GROUP })
  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: CategoryEntity | null;

  @Expose({ groups: ALL_GROUP })
  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children?: CategoryEntity[];
}
