import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsObject,
  Min,
} from 'class-validator';
import { PaymentProvider } from '../entities/payment.entity';
import {
  CustomIsEnum,
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsObject,
  CustomIsOptional,
  CustomIsString,
  CustomMin,
} from 'src/common/request/validators/custom-validator';

export class CreatePaymentDto {
  userId: number;

  @ApiPropertyOptional({
    description: 'shippingAddress id',
    example: '1',
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  shippingAddress?: number;


  @ApiPropertyOptional({
    description: 'BillingAddress id',
    example: '1',
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  BillingAddress?: number;

  @ApiProperty({
    description: 'Currency code for the transaction (ISO 4217 format)',
    example: 'USD',
  })
  @CustomIsString()
  currency: string;

  @ApiProperty({
    description: 'Payment provider to process the transaction',
    enum: PaymentProvider,
    example: PaymentProvider.PAYPAL,
  })
  @CustomIsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiPropertyOptional({
    description: 'Optional payment description or note',
    example: 'Payment for premium subscription plan',
  })
  @CustomIsOptional()
  @CustomIsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Additional custom metadata for payment tracking',
    example: { customerNote: 'Deliver by Monday' },
  })
  @CustomIsOptional()
  @CustomIsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Existing payment method ID (used for saved cards, etc.)',
    example: 'pm_123456789',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  paymentMethodId?: string;

  @ApiPropertyOptional({
    description: 'URL to redirect after successful payment',
    example: 'http://localhost:5173/success',
  })
  @CustomIsOptional()
  @CustomIsString()
  returnUrl?: string;

  @ApiPropertyOptional({
    description: 'URL to redirect after canceled payment',
    example: 'http://localhost:5173/cancel',
  })
  @CustomIsOptional()
  @CustomIsString()
  cancelUrl?: string;
}
