import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
import { IBlogCategoryEntity } from '../interfaces/blog-category.entity.interface';

export const BLOG_CATEGORY_DATABASE_TABLE_NAME = 'blog_categories';

import slugify from 'slugify';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';

@Entity({ name: BLOG_CATEGORY_DATABASE_TABLE_NAME })
@Index(['name'])
export class BlogCategoryEntity
  extends DatabaseBaseEntity
  implements IBlogCategoryEntity
{
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @OneToMany(() => BlogEntity, (blog) => blog.category)
  blogs: BlogEntity[];
 @OneToMany(() => BlogEntity, (blog) => blog.category)
  blog: BlogEntity[];
  @BeforeInsert()
  @BeforeUpdate()
  generateSlug(): void {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
  }
}
