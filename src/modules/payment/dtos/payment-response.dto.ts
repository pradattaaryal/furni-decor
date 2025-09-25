import { ApiProperty } from '@nestjs/swagger';
import { PAYMENT_STATUS } from '../constants/payment.constant';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Redirect URL to hosted payment page',
    example: 'https://checkout.stripe.com/pay/cs_test_...',
  })
  redirectUrl: string;

  @ApiProperty({
    description: 'Payment ID in our system',
    example: 1,
  })
  paymentId: number;

  @ApiProperty({
    description: 'Gateway payment ID',
    example: 'pi_1Q2w3e4r5t6y7u8i9o0p',
  })
  gatewayId: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'PAYMENT_PENDING',
  })
  status: string;
} 