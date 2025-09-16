import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  ADMIN_ONLY_GROUP,
  ALL_GROUP,
} from 'src/common/database/constant/serialization-group.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { FILE_ASSOCIATION_TYPE } from '../constants/association-type.enum';
import { IImageInterface } from '../interfaces/image.interfaces';

export const IMAGE_TABLE_NAME = 'image';

@Index(['type', 'deletedAt'], {
  where: "type = 'product_variants' AND deleted_at IS NULL",
})
@Entity({ name: IMAGE_TABLE_NAME })
export class ImageEntity extends DatabaseBaseEntity implements IImageInterface {
  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 50 })
  mime: string;

  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: new BigIntTransformerPipe(),
  })
  size?: number;

  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Index()
  @Column({
    type: 'varchar',
    length: 100,
    name: 'type',
    nullable: true,
  })
  type?: string | null;
}
