export abstract class AbstractPaymentService {
  abstract payment(options: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
  }): Promise<{ id: string; url: string; payment_status: string }>;

  abstract cancelPayment(): Promise<any>;

// abstract status_update(id:string)
// abstract Update_transactionId(transactionId:string,orderId:string)




  
}
