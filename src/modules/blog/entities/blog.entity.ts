import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { BlogCategoryEntity } from 'src/modules/blog-category/entities/blog-category.entity';

@Entity({ name: 'blogs' })
export class BlogEntity extends DatabaseBaseEntity {
  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'title', type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'content', type: 'text', nullable: true })
  content?: string;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId?: number;

  @Column({ name: 'image_id', type: 'int', nullable: true })
  imageId?: number;

  @Column({ name: 'author_id', type: 'int' })
  authorId: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  slug: string;

  @ManyToOne(() => UserEntity, (user) => user.blogs, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({
    name: 'name_tsv',
    type: 'tsvector',
    nullable: true,
  })
  @Index('blog_name_tsv_idx', { synchronize: false })
  nameTsv: string;

  @ManyToOne(() => BlogCategoryEntity, (category) => category.blog, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'category_id' })
  category?: BlogCategoryEntity;

  @ManyToOne(() => ImageEntity, (image) => image.blogs, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'image_id' })
  image?: ImageEntity;
}
