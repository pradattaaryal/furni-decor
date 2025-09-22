import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemQuantityDto {
  @ApiProperty({ description: 'Quantity to increase', example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
