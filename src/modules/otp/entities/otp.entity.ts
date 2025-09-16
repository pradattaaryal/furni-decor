import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class OtpEntity extends DatabaseBaseEntity {
  @Column()
  UserEntity_id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  otp: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expires_at: Date;

  //////////////Relation////////////////////

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserEntity_id' })
  UserEntity: UserEntity;
}
