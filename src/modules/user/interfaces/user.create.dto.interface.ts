export interface IUserCreateDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  imageId?: number;
}
