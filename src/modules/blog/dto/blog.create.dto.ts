import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
} from 'class-validator';
import { faker } from '@faker-js/faker';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog',
    example: faker.lorem.words(5),
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Short description of the blog',
    example: faker.lorem.sentence(),
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Full content of the blog',
    example: faker.lorem.paragraphs(3),
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'ID of the category',
    example: faker.datatype.number({ min: 1, max: 10 }),
    required: false,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({
    description: 'ID of the image',
    example: faker.datatype.number({ min: 1, max: 100 }),
    required: false,
  })
  @IsOptional()
  @IsInt()
  imageId?: number;

  @ApiProperty({
    description: 'ID of the author (user)',
    example: faker.datatype.number({ min: 1, max: 50 }),
  })
  @IsInt()
  authorId: number;

  @ApiProperty({
    description: 'Is the blog active?',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
