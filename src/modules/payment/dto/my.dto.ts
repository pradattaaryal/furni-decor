// dto/init-payment.dto.ts
import { IsString, IsArray, ValidateNested, IsNumber, Min, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for individual order items
 */
export class PaymentOrderItemDto {
  @ApiProperty({ description: 'Internal product ID', example: 101 })
  @IsNumber()
  productId: number;

  @ApiPropertyOptional({ description: 'Variant ID if applicable', example: 201 })
  @IsOptional()
  @IsNumber()
  variantId?: number;

  @ApiProperty({ description: 'Name of the product', example: 'Premium Package' })
  @IsString()
  productName: string;

  @ApiProperty({ description: 'Color of the product', example: 'Red' })
  @IsString()
  color: string;

  @ApiProperty({ description: 'Model or version of the product', example: 'PX-2000' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Price per unit', example: 49.99 })
  @IsNumber()
  price: number;
}

/**
 * DTO for initializing a payment (Stripe / PayPal)
 */
export class InitPaymentDto {
  @ApiProperty({ description: 'User ID placing the order', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Total order price', example: 99.98 })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'Items included in the order',
    type: [PaymentOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentOrderItemDto)
  items: PaymentOrderItemDto[];
 
  @ApiProperty({
    description: 'Payment gateway to use',
    example: 'paypal',
    enum: ['stripe', 'paypal'],
  })
  @IsString()
  @IsIn(['stripe', 'paypal'])
  paymentMethod: 'stripe' | 'paypal';

  @ApiPropertyOptional({
    description: 'Payment intent for PayPal only: CAPTURE or AUTHORIZE',
    example: 'CAPTURE',
    enum: ['CAPTURE', 'AUTHORIZE'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['CAPTURE', 'AUTHORIZE'])
  intent?: 'CAPTURE' | 'AUTHORIZE';

 
  @ApiPropertyOptional({ description: 'Optional metadata for internal use', example: { campaign: 'SUMMER2025' } })
  @IsOptional()
  metadata?: Record<string, any>;
}
