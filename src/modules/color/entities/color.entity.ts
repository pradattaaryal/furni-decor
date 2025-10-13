import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { IColorEntity } from '../interfaces/color.entity.interface';
import { ProductVariantEntity } from 'src/modules/product-variants/entities/product-variant.entity';

export const COLOR_DATABASE_TABLE_NAME = 'colors';

@Entity({ name: COLOR_DATABASE_TABLE_NAME })
@Index(['name'])
export class ColorEntity extends DatabaseBaseEntity implements IColorEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 7 })
  hexCode: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @OneToMany(() => ProductVariantEntity, (variant) => variant.color)
  variants: ProductVariantEntity[];
}
