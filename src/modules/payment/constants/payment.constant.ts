export const PAYMENT_PAYPAL_PROVIDER = 'PAYMENT_PAYPAL_PROVIDER';
export const PAYMENT_STRIPE_PROVIDER = 'PAYMENT_STRIPE_PROVIDER';

export enum PAYMENT_STATUS {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',
}
export enum PAYMENT_METHOD {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
}
export interface PaymentMetadata {
  paymentId: string;
  userId: string;
  orderId: string;
  [key: string]: string;
}
