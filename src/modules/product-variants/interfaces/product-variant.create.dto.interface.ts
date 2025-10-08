export interface IProductVariantCreateDto {
  dimensions: Record<string, number>;
  color: string;
  productId: number;
  quantity?: number;
  imageId?: number;
}
