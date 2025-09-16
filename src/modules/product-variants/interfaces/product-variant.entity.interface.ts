export interface IProductVariantEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  productId: number;
  dimensions: Record<string, any>;
  color: string;
  count?: number | null;
  price?: number | null;
  imageId?: number | null;
}
