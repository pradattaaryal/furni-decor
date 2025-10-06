export interface PaymentIntentResponse {
  clientSecret?: string;
  approvalUrl?: string;
  paymentIntentId: string;
  status: string;
}

export interface PaymentConfirmationResponse {
  success: boolean;
  transactionId: string;
  status: string;
  metadata?: any;
}

export interface PaymentProvider {
  createPaymentIntent(
    payment: any,
    options?: any,
  ): Promise<PaymentIntentResponse>;
  confirmPayment(
    paymentIntentId: string,
    options?: any,
  ): Promise<PaymentConfirmationResponse>;
  refundPayment(transactionId: string, amount?: number): Promise<any>;
  getPaymentStatus(paymentIntentId: string): Promise<string>;
}
