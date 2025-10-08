import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ORDER_STATUS } from '../constant/order.constant';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New status of the order',
    enum: ORDER_STATUS, // <-- Enum for drop-down
    example: ORDER_STATUS.ORDER_COMPLETED, // Example selected by default
  })
  @IsEnum(ORDER_STATUS, {
    message: `Status must be one of: ${Object.values(ORDER_STATUS).join(', ')}`,
  })
  status: ORDER_STATUS;
}
