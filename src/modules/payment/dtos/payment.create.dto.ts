import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsString,
  CustomMaxLength,
} from 'src/common/request/validators/custom-validator';
import { IPaymentCreateDto } from '../interfaces/payment.interface';
import { PAYMENT_METHOD } from '../constants/payment.constant';

export class PaymentCreateDto implements IPaymentCreateDto {
  @ApiProperty({
    required: true,
    type: 'number',
    example: 1,
    description: 'ID of the order associated with this payment',
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  orderId: number;

  @ApiProperty({
    required: true,
    type: 'number',
    example: 199.99,
    description: 'Amount to be paid',
  })
  @CustomIsNotEmpty()
  @CustomIsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    type: 'string',
    example: 'AUD',
    description: 'Currency code for the payment',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMaxLength(10)
  currency: string;

  @ApiProperty({
    required: true,
    enum: PAYMENT_METHOD,
    example: PAYMENT_METHOD.STRIPE,
    description: 'Payment method to be used',
  })
  @CustomIsNotEmpty()
  paymentMethod: PAYMENT_METHOD;

  @ApiProperty({
    required: false,
    type: 'string',
    example: 'Payment for event registration',
    description: 'Description of the payment',
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(500)
  description?: string;
} 