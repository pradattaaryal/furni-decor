import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { BaseUserEntity } from 'src/common/database/base/entity/BaseUserEntity';
import { ProductRatingEntity } from 'src/modules/product-rating/entities/product-rating.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { ShippingAddressEntity } from 'src/modules/shipping-address/entities/shipping-address.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { WishlistEntity } from 'src/modules/wishlist/entities/wishlist.entity';

export const USERS_DATABASE_TABLE_NAME = 'users';

@Entity({ name: USERS_DATABASE_TABLE_NAME })
export class UserEntity extends BaseUserEntity {
  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName: string | null;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName: string | null;

  @OneToMany(() => ProductRatingEntity, (rating) => rating.user)
  productRatings: ProductRatingEntity[];

  @OneToOne(() => ImageEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity | null;

  @OneToOne(() => CartEntity, (cart) => cart.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity | null;


  @OneToMany(() => ShippingAddressEntity, (address) => address.user)
  shippingAddresses: ShippingAddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.user)
  wishlists: WishlistEntity[];
}
