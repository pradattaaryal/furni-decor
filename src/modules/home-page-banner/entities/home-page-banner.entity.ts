import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IHomePageBannerEntity } from '../interfaces/home-page-banner.entity.interface';
import { ImageEntity } from 'src/modules/image/entities/image.entity';

export const HOME_PAGE_BANNER_DATABASE_TABLE_NAME = 'home_page_banners';

@Entity({ name: HOME_PAGE_BANNER_DATABASE_TABLE_NAME })
@Index(['orderIndex'])
@Index(['isActive'])
export class HomePageBannerEntity
  extends DatabaseBaseEntity
  implements IHomePageBannerEntity
{
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'image_id' })
  imageId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link?: string | null;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => ImageEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'image_id' })
  image?: ImageEntity;
}
