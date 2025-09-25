import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PAYMENT_METHOD } from '../constants/payment.constant';

export class PaymentInitiateDto {
  @ApiProperty({
    description: 'ID of the order to pay for',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @ApiProperty({
    enum: PAYMENT_METHOD,
    description: 'Payment method to use',
    example: PAYMENT_METHOD.STRIPE,
  })
  @IsNotEmpty()
  @IsEnum(PAYMENT_METHOD)
  paymentMethod: PAYMENT_METHOD;

  @ApiProperty({
    description: 'Currency for the payment',
    example: 'AUD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;
} 