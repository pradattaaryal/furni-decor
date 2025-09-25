import { PAYMENT_METHOD, PAYMENT_STATUS } from '../constants/payment.constant';

export interface IPaymentEntity {
  paymentMethod: PAYMENT_METHOD;
  transactionId?: string;
  status: PAYMENT_STATUS;
  paidAt?: Date | null;
  amount: number;
  currency: string;
  orderId: number;
}
