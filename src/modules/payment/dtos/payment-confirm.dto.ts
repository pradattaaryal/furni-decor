import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PAYMENT_METHOD } from '../constants/payment.constant';

export class PaymentConfirmDto {
  @ApiProperty({
    description: 'ID of the payment to confirm',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  paymentId: number;

  @ApiProperty({
    enum: PAYMENT_METHOD,
    description: 'Payment method used',
    example: PAYMENT_METHOD.STRIPE,
  })
  @IsNotEmpty()
  @IsEnum(PAYMENT_METHOD)
  paymentMethod: PAYMENT_METHOD;

  @ApiProperty({
    description: 'Gateway payment ID (required for PayPal)',
    example: 'pi_1Q2w3e4r5t6y7u8i9o0p',
    required: false,
  })
  @IsOptional()
  @IsString()
  gatewayId?: string;
} 