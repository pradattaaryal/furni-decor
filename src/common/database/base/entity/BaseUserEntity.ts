import { ApiProperty } from '@nestjs/swagger';
import { IBaseUserEntity } from '../../interfaces/user.base.interface';
import { DatabaseBaseEntity } from './BaseEntity';
import { Exclude, Expose } from 'class-transformer';
import { ALL_GROUP } from '../../constant/serialization-group.constant';
import { BeforeInsert, Column, Index } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'src/modules/user/constant/user-type.constant';

export class BaseUserEntity
  extends DatabaseBaseEntity
  implements IBaseUserEntity
{
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Index()
  @Column({ type: String, length: 100, unique: true, nullable: false })
  email: string;

  @Exclude()
  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  password: string;

  @ApiProperty({
    description: 'Indicates if the user is verified',
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @ApiProperty()
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: string;

  @Column({ type: 'timestamptz', name: 'password_changed_at', nullable: true })
  password_changed_at: Date;
}
