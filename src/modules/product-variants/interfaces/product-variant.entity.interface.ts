export interface IProductVariantEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  productId: number;
  colorId: number;

  imageId?: number | null;
}
