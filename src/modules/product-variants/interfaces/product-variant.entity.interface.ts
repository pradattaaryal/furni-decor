export interface IProductVariantEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  productId: number;
  dimensions: Record<string, number>;
  color: string;
  quantity?: number | null;

  imageId?: number | null;
}
