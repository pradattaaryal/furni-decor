import { IUserEntity } from 'src/modules/user/interfaces/user.entity.interface';
// import { ICartItemEntity } from 'src/modules/cart-items/interfaces/cart-item.entity.interface';

export interface ICartEntity {
  id: number; // inherited from BaseEntity but still good to be explicit
  userId: number;
  totalPrice: number;
  isActive: boolean;
  // ========== RELATIONS ==========
  user: IUserEntity;
  // items?: ICartItemEntity[];
}
