import { Column, Entity } from 'typeorm';
import {
  PaymentProviderEnum,
  PaymentStatus,
} from '../constant/payment.constant';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';

@Entity('payments')
export class PaymentEntity extends DatabaseBaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentProviderEnum,
  })
  provider: PaymentProviderEnum;

  @Column({ nullable: true })
  providerTransactionId: string;

  @Column({ nullable: true })
  providerPaymentIntentId: string;

  @Column('json', { nullable: true })
  metadata: any;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  orderId: string;
}
