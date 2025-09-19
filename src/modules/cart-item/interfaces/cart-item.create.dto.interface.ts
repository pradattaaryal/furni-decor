export interface ICartItemCreateDto {
  cartId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
}
