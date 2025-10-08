export interface IProductVariantDto {
  id: number;
  productId: number;
  dimensions: Record<string, number>;
  color: string;
  quantity: number | null;
  imageId: number | null;
}
