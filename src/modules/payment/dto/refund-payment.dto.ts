import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class RefundPaymentDto {
  @IsString()
  paymentId: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
