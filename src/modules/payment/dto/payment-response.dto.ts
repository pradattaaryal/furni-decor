import { PaymentStatus, PaymentProvider } from '../entities/payment.entity';

export class PaymentResponseDto {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerTransactionId?: string;
  providerPaymentId?: string;
  description?: string;
  checkoutUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
