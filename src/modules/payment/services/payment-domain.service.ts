// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PAYMENT_STATUS } from '../constants/payment.constant';
// import { PaymentRepository } from '../repositories/payment.repository';
// import { PaymentEntity } from '../entities/payment.entity';
// import { OrderRepository } from 'src/modules/order/repositories/order/order.repository';

// @Injectable()
// export class PaymentDomainService {
//   constructor(
//     private readonly paymentRepository: PaymentRepository,
//     private readonly orderRepository: OrderRepository,
//   ) {}

//   async completePaymentAndLink(
    
//     paymentId: number,
//     transactionId: string,
//   ): Promise<PaymentEntity> {
//     const payment = await this.paymentRepository._findOneById(paymentId);
//     if (!payment) {
//       throw new NotFoundException('Payment not found');
//     }

//     payment.status = PAYMENT_STATUS.PAYMENT_COMPLETED;
//     payment.transactionId = transactionId;
//     payment.paidAt = new Date();
//     const updatedPayment = await this.paymentRepository._update(payment);

//     const orderId = payment.orderId;
//     const order = await this.orderRepository._findOneById(orderId);
//     if (order) {
//       order.payment = updatedPayment;
//       await this.orderRepository._update(order);
//     }

//     return updatedPayment;
//   }

//   async cancelPayment(paymentId: number): Promise<PaymentEntity> {
//     const payment = await this.paymentRepository._findOneById(paymentId);
//     if (!payment) {
//       throw new NotFoundException('Payment not found');
//     }

//     payment.status = PAYMENT_STATUS.PAYMENT_CANCELLED;
//     return await this.paymentRepository._update(payment);
//   }

//   async updatePaymentStatus(
//     paymentId: number,
//     status: PAYMENT_STATUS,
//     extra?: Partial<Pick<PaymentEntity, 'transactionId' | 'paidAt'>>,
//   ): Promise<PaymentEntity> {
//     const payment = await this.paymentRepository._findOneById(paymentId);
//     if (!payment) {
//       throw new NotFoundException('Payment not found');
//     }

//     payment.status = status;
//     if (extra?.transactionId !== undefined) payment.transactionId = extra.transactionId;
//     if (extra?.paidAt !== undefined) payment.paidAt = extra.paidAt;

//     return await this.paymentRepository._update(payment);
//   }
// } 