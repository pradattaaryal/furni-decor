import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { PaymentStatus, PaymentProvider } from '../entities/payment.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ enum: PaymentProvider })
  provider: PaymentProvider;

  @ApiProperty({ required: false })
  providerPaymentId?: string;

  @ApiProperty({ required: false })
  providerTransactionId?: string;

  @ApiProperty({ required: false })
  checkoutUrl?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  cart?: CartEntity;
}
