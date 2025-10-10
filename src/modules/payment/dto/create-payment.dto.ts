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

  @ApiProperty({
    description: 'shippingaddress ID associated with the payment',
    example: 6,
  })
  @CustomIsNumber()
  shippingaddress: number;

  @ApiProperty({
    description: 'Cart ID associated with the payment',
    example: 6,
  })
  @CustomIsNumber()
  CartId: number;

  @ApiProperty({
    description: 'Payment amount to be charged',
    example: 99.99,
    minimum: 0.01,
  })
  @CustomIsNumber()
  @CustomMin(0.01)
  amount: number;

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
    example: 'https://yourapp.com/payment/success',
  })
  @CustomIsOptional()
  @CustomIsString()
  returnUrl?: string;

  @ApiPropertyOptional({
    description: 'URL to redirect after canceled payment',
    example: 'https://yourapp.com/payment/cancel',
  })
  @CustomIsOptional()
  @CustomIsString()
  cancelUrl?: string;
}
