export interface IProductVariantCreateDto {
  dimensions: Record<number, any>;
  color: string;
  productId: number;
   quantity?: number;
  imageId?: number;
}
