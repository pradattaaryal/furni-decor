export interface IProductVariantDto {
  id: number;
  productId: number;
  dimensions: Record<string, any>;
  color: string;
  count: number | null;
  imageId: number | null;
}
