export interface IWishlist {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
