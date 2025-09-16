import { ApiProperty } from '@nestjs/swagger';
import { IImageInterface } from '../interfaces/image.interfaces';
import { faker } from '@faker-js/faker';
import {
  CustomIsBoolean,
  CustomIsNotEmpty,
  CustomIsNumber,
  CustomIsOptional,
  CustomIsString,
  CustomMaxLength,
} from 'src/common/request/validators/custom-validator';

export class BasePhoto implements IImageInterface {
  @ApiProperty({
    required: true,
    example: 1,
  })
  @CustomIsNumber()
  @CustomIsNotEmpty()
  id: number;

  @ApiProperty({
    required: false,
    example: faker.internet.url(),
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  path: string;

  @ApiProperty({
    required: false,
    example: faker.lorem.word(),
  })
  @CustomIsString()
  @CustomIsNotEmpty()
  filename: string;

  @ApiProperty({
    required: false,
    example: faker.lorem.word(),
  })
  @CustomIsString()
  @CustomIsOptional()
  mime?: string;

  @ApiProperty({
    required: false,
    example: faker.internet.url(),
  })
  @CustomIsString()
  @CustomIsOptional()
  completeUrl?: string;

  @ApiProperty({
    required: false,
    example: faker.internet.url(),
  })
  @CustomIsString()
  @CustomIsOptional()
  baseUrl?: string;

  @ApiProperty({
    required: false,
    example: faker.number.int(),
  })
  @CustomIsOptional()
  @CustomIsString()
  size?: number;

  @ApiProperty({
    required: false,
    example: faker.lorem.sentence(),
    type: String,
    maxLength: 255,
  })
  @CustomIsString()
  @CustomIsOptional()
  @CustomMaxLength(255)
  description?: string;

  @ApiProperty({
    required: false,
    example: faker.lorem.word(),
    type: String,
    maxLength: 255,
  })
  @CustomIsString()
  @CustomIsOptional()
  @CustomMaxLength(255)
  name?: string;

  @ApiProperty({
    required: false,
    example: faker.datatype.boolean(),
  })
  @CustomIsOptional()
  @CustomIsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    required: false,
    example: faker.number.int(),
  })
  @CustomIsOptional()
  @CustomIsNumber()
  index?: number | null;
}
