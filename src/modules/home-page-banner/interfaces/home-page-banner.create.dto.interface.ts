export interface IHomePageBannerCreateDto {
  title: string;
  description?: string;
  imageId: number;
  link?: string;
  orderIndex: number;
  isActive?: boolean;
}
