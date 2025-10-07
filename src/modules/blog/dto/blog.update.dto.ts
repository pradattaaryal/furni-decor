import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './blog.create.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
