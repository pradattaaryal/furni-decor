import { ApiProperty } from '@nestjs/swagger';
import { IBaseUserEntity } from '../../interfaces/user.base.interface';
import { DatabaseBaseEntity } from './BaseEntity';
import { Exclude, Expose } from 'class-transformer';
import { ALL_GROUP } from '../../constant/serialization-group.constant';
import { BeforeInsert, Column, Index } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class BaseUserEntity
  extends DatabaseBaseEntity
  implements IBaseUserEntity
{
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Index()
  @Column({ type: String, length: 100, unique: true, nullable: true })
  email: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'text', nullable: false, select: false })
  password: string;

  @ApiProperty()
  @Column({ name: 'role', type: 'varchar', length: 220, nullable: true })
  role: string;
 
  @Column({ type: 'timestamptz', name: 'password_changed_at',nullable: true })
  password_changed_at: Date;

  @BeforeInsert()
  async hashPasswordBeforeInsertOrUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
