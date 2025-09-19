export interface IProductVariantDto {
  id: number;
  productId: number;
  dimensions: Record<number, any>;
  color: string;
  quantity: number | null;
  imageId: number | null;
}
