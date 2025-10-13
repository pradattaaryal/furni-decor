import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  CustomIsNotEmpty,
  CustomIsOptional,
  CustomIsString,
  CustomMaxLength,
  CustomMinLength,
  CustomMatches,
} from 'src/common/request/validators/custom-validator';
import { IColorCreateDto } from '../interfaces/color.create.dto.interface';

export class ColorCreateDto implements IColorCreateDto {
  @ApiProperty({
    example: 'Ocean Blue',
    description: 'Color name',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(255)
  @Transform(({ value }: { value: string }) => value.trim())
  name: string;

  @ApiProperty({
    example: '#1F75FE',
    description: 'Hexadecimal color code (e.g., #RRGGBB)',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMatches(/^#([0-9a-fA-F]{6})$/)
  @Transform(({ value }: { value: string }) => value.trim())
  hexCode: string;

  @ApiProperty({
    example: faker.lorem.sentence(),
    description: 'Color description',
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMaxLength(1000)
  description?: string;
}
