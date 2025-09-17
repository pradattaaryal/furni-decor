import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { BaseUserEntity } from 'src/common/database/base/entity/BaseUserEntity';
import { ProductRatingEntity } from 'src/modules/product-rating/entities/product-rating.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';

export const USERS_DATABASE_TABLE_NAME = 'users';

@Entity({ name: USERS_DATABASE_TABLE_NAME })
export class UserEntity extends BaseUserEntity {
  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName: string | null;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName: string | null;

  @OneToMany(() => ProductRatingEntity, (rating) => rating.user)
  productRatings: ProductRatingEntity[];

  @OneToOne(() => ImageEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity | null;
}
