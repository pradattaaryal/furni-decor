import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
} from 'class-validator';
import { faker } from '@faker-js/faker';
import { CustomIsBoolean, CustomIsNumber, CustomIsOptional, CustomIsString, CustomMax } from 'src/common/request/validators/custom-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog',
    example: faker.lorem.words(5),
    maxLength: 200,
  })
  @CustomIsString()
  @CustomMax(200)
  title: string;

  @ApiProperty({
    description: 'Short description of the blog',
    example: faker.lorem.sentence(),
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  description?: string;

  @ApiProperty({
    description: 'Full content of the blog',
    example: faker.lorem.paragraphs(3),
    required: false,
  })
  @CustomIsOptional()
  @CustomIsString()
  content?: string;

  @ApiProperty({
    description: 'ID of the category',
    example: faker.datatype.number({ min: 1, max: 10 }),
    required: false,
  })
  @CustomIsNumber()
  categoryId?: number;

  @ApiProperty({
    description: 'ID of the image',
    example: faker.datatype.number({ min: 1, max: 100 }),
    required: false,
  })
  @CustomIsOptional()
  @CustomIsNumber()
  imageId?: number;

  @ApiProperty({
    description: 'ID of the author (user)',
    example: faker.datatype.number({ min: 1, max: 50 }),
  })
  @CustomIsNumber()
  authorId: number;

  @ApiProperty({
    description: 'Is the blog active?',
    example: true,
    required: false,
  })
  @CustomIsOptional()
  @CustomIsBoolean()
  active?: boolean;
}
