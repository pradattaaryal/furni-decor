import { PaymentProvider } from '../entities/payment.entity';

export class WebhookEventDto {
  eventType: string;
  provider: PaymentProvider;
  data: any;
  signature?: string;
}
