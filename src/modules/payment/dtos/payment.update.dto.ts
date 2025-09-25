import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsOptional,
  CustomIsString,
  CustomIsISO9601DateString,
} from 'src/common/request/validators/custom-validator';
import { IPaymentUpdateDto } from '../interfaces/payment.interface';
import { PAYMENT_STATUS } from '../constants/payment.constant';

export class PaymentUpdateDto implements IPaymentUpdateDto {
  @ApiProperty({
    required: false,
    enum: PAYMENT_STATUS,
    example: PAYMENT_STATUS.PAYMENT_COMPLETED,
    description: 'Status of the payment',
  })
  @CustomIsOptional()
  @CustomIsString()
  status?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    example: 'pi_1Q2w3e4r5t6y7u8i9o0p',
    description: 'Transaction ID from payment provider',
  })
  @CustomIsOptional()
  @CustomIsString()
  transactionId?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'date-time',
    example: '2025-01-15T12:30:00Z',
    description: 'Timestamp when payment was completed',
  })
  @CustomIsOptional()
  @CustomIsISO9601DateString()
  paidAt?: Date;
} 