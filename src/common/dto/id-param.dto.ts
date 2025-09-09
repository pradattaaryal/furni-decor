import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class IdParamDto {
  @ApiProperty({
    description: 'ID of the resource',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  id: number;
}
