export interface IPaymentOptions {
  stripe: boolean;
  paypal: boolean;
}

export interface IPaymentCreateDto {
  orderId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  description?: string;
}

export interface IPaymentUpdateDto {
  status?: string;
  transactionId?: string;
  paidAt?: Date;
}

export interface IPaymentProcessDto {
  userId: number;
  userEmail: string;
  userType: string;
  pendingAmount?: number;
  currency?: string;
  productName?: string;
  orderId?: number;
}

// New interfaces for the refactored payment system
import { PAYMENT_METHOD } from '../constants/payment.constant';

export interface IPaymentInitiateDto {
  orderId: number;
  paymentMethod: PAYMENT_METHOD;
  currency?: string;
}

export interface IPaymentResponse {
  redirectUrl: string;
  paymentId: number;
  gatewayId: string;
  status: string;
}

export interface IPaymentConfirmDto {
  paymentId: number;
  paymentMethod: PAYMENT_METHOD;
  gatewayId?: string;
}

export interface IPaymentSuccessResponse {
  paymentDetails: {
    id: number;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    createdAt: Date;
  };
  orderDetails: {
    id: number;
    status: string;
    totalAmount: number;
    orderItems: Array<{
      id: number;
      quantity: number;
      price: number;
      ticket: {
        id: number;
        name: string;
        description: string;
        price: number;
        ticketTypeName: string;
      };
    }>;
  };
}

export interface IStripeCheckoutSession {
  id: string;
  url: string;
  payment_status: string;
}

export interface IPayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface IPayPalCaptureResult {
  id: string;
  status: string;
  payment_source: any;
}
