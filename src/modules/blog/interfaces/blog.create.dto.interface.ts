export interface ICreateBlogDto {
  title: string;
  description?: string;
  content?: string;
  categoryId?: number;
  imageId?: number;
  authorId: number;
  active?: boolean;
}
