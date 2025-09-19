export interface IProductVariantUpdateDto {
  id?: number;
  dimensions?: Record<string, any>;
  color?: string;
  productId?: number;
  quantity?: number;
  imageId?: number;
}
