import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
import { CartItemEntity } from 'src/modules/cart-item/entities/cart-item.entity';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import Stripe from 'stripe';

export interface PaymentResult {
  success: boolean;
  cart?: CartEntity;
  paymentId: string;
  transactionId?: string;
  status: PaymentStatus;
  checkoutUrl?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  status: string;
  errorMessage?: string;
}

export interface PaymentAdapterInterface {
  createPayment(
    data: PaymentEntity,
    createPaymentDto: CreatePaymentDto,
    CartData: CartEntity,
  ): Promise<PaymentResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>;
  cancelPayment(paymentId: string): Promise<boolean>;
verifyWebhook(payload: Buffer, signature: string) }
