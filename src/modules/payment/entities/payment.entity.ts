// import { ApiProperty } from '@nestjs/swagger';
// import { Expose } from 'class-transformer';
// import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
// import { PAYMENT_METHOD, PAYMENT_STATUS } from '../constants/payment.constant';
// import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
// import { IPaymentEntity } from '../interfaces/payment.entity.interface';
// import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
// import { OrderEntity } from 'src/modules/order/entities/order.entity';

// @Entity('payments')
// export class PaymentEntity
//   extends DatabaseBaseEntity
//   implements IPaymentEntity {

//   @ApiProperty({
//     enum: PAYMENT_METHOD,
//     description: 'Payment method used for the transaction',
//     example: PAYMENT_METHOD.STRIPE,
//   })
//   @Expose({ groups: ALL_GROUP })
//   @Column({
//     type: 'enum',
//     enum: PAYMENT_METHOD,
//     default: PAYMENT_METHOD.STRIPE,
//   })
//   paymentMethod: PAYMENT_METHOD;

//   @ApiProperty({
//     description: 'Unique identifier for the payment transaction',
//     example: 'pi_1Q2w3e4r5t6y7u8i9o0p',
//     nullable: true,
//   })
//   @Expose({ groups: ALL_GROUP })
//   @Column({ length: 255, nullable: true })
//   transactionId: string;
 

//   @ApiProperty({
//     enum: PAYMENT_STATUS,
//     description: 'Current status of the payment',
//     example: PAYMENT_STATUS.PAYMENT_PENDING,
//   })
//   @Expose({ groups: ALL_GROUP })
//   @Column({
//     type: 'enum',
//     enum: PAYMENT_STATUS,
//     default: PAYMENT_STATUS.PAYMENT_PENDING,
//   })
//   status: PAYMENT_STATUS;

//   @ApiProperty({
//     description: 'Amount of the payment',
//     example: 199.99,
//   })
//   @Expose({ groups: ALL_GROUP })
//   @Column('decimal', { precision: 10, scale: 2 })
//   amount: number;

//   @ApiProperty({
//     description: 'Currency of the payment',
//     example: 'AUD',
//   })
//   @Expose({ groups: ALL_GROUP })
//   @Column({ length: 10 })
//   currency: string;

//   @ApiProperty({
//     description: 'Timestamp when the payment was successfully completed',
//     type: Date,
//     nullable: true,
//     example: '2025-08-01T12:30:00Z',
//   })
//   @Expose({ groups: ALL_GROUP })
//   @Column({ type: 'timestamptz', nullable: true })
//   paidAt: Date | null;

//   @ApiProperty({
//     description: 'ID of the associated order',
//     example: 1,
//   })
//   @Expose({ groups: ALL_GROUP })
//   @Column({ type: 'int' })
//   orderId: number;

//   // ======================
//   // Relations
//   // ======================

//   @ApiProperty({
//     description: 'Associated order for this payment',
//     type: () => OrderEntity,
//   })
//   @Expose({ groups: ALL_GROUP })
//   @OneToOne(() => OrderEntity, (order) => order.payment, { nullable: false })
//   @JoinColumn({ name: 'orderId' })
//   order: OrderEntity;
// }
