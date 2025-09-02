import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { BaseUserEntity } from 'src/common/database/base/entity/BaseUserEntity';
// import { ImageEntity } from 'src/common/database/entities/image.entity';

export const USERS_DATABASE_TABLE_NAME = 'users';

@Entity({ name: USERS_DATABASE_TABLE_NAME })
export class UserEntity extends BaseUserEntity {
  @ApiProperty({ example: 'John' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName: string | null;

  // Optional relation to image (commented out if not needed yet)
  // @ApiProperty({ type: () => ImageEntity, description: 'Profile picture reference' })
  // @Expose({ groups: ALL_GROUP })
  // @OneToOne(() => ImageEntity, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'image_id' })
  // image: ImageEntity | null;

  @ApiProperty({ example: new Date().toISOString() })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'password_changed_at', type: 'timestamp', nullable: true })
  passwordChangedAt: Date | null;
}
