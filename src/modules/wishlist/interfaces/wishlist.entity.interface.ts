export interface IWishlist {
  id: number;
  userId: number;
  productId: number;
  variantId?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
