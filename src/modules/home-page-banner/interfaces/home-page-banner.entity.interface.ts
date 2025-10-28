export interface IHomePageBannerEntity {
  title: string;
  description?: string | null;
  imageId: number;
  link?: string | null;
  orderIndex: number;
  isActive: boolean;
}
