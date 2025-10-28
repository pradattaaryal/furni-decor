import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'subscribers' })
@Index(['email'], { unique: true })  
export class NewsletterEntity extends DatabaseBaseEntity{

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
    comment: 'Unique email address of the subscriber',
  })
  email: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Indicates whether the subscription is active',
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'subscribed_at',
    type: 'timestamp with time zone',
    comment: 'Timestamp when the subscriber joined the newsletter',
  })
  subscribedAt: Date;
}
