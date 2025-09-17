export interface IProductVariantCreateDto {
  dimensions: Record<string, any>;
  color: string;
  productId: number;
  count?: number;
  imageId?: number;
}
