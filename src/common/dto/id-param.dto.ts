import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsString,
} from '../request/validators/custom-validator';

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

// export class SlugParamDto {
//   @ApiProperty({
//     description: 'Slug of the resource',
//     example: "productA-1",
//   })
//   @CustomIsNotEmpty()
//   @CustomIsString()
//   slug: string;
// }
