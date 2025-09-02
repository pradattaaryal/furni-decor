import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ADMIN_ONLY_GROUP,
  ALL_GROUP,
  DELETE_AT_FIELD_GROUP,
} from '../../constant/serialization-group.constant';
@Index(['id', 'createdAt']) //Composite index
export class DatabaseBaseEntity extends BaseEntity {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Generated()
  @Index({ where: '"deleted_at" IS NULL' })
  @PrimaryColumn({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
  })
  id: number;

  @Expose({ groups: ADMIN_ONLY_GROUP })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Expose({ groups: ADMIN_ONLY_GROUP })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Expose({ groups: DELETE_AT_FIELD_GROUP })
  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt: Date;
}
