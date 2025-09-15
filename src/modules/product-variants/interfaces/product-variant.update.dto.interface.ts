export interface IProductVariantUpdateDto {
  id?: number;
  dimensions?: Record<string, any>;
  color?: string;
  productId?: number;
  price?: number;
  count?: number;
  imageId?: number;
}