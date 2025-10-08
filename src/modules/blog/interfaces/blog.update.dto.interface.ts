import { ICreateBlogDto } from './blog.create.dto.interface';

export interface IBlogUpdateDto extends Partial<ICreateBlogDto> {}
