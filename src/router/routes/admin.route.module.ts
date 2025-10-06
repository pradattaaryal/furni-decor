import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { AdminUserController } from 'src/modules/user/controllers/user.admin.controller';
import { AuthAdminController } from 'src/modules/authentication/controllers/auth.admin.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryAdminController } from 'src/modules/category/controllers/category.admin.controller';
import { ProductsModule } from 'src/modules/products/products.module';
import { ProductAdminController } from 'src/modules/products/controllers/product.admin.controller';
import { ProductVariantsModule } from 'src/modules/product-variants/product-variants.module';
import { ProductVarientsAdminController } from 'src/modules/product-variants/controllers/product-variant.admin.controller';
import { ProductRatingAdminController } from 'src/modules/product-rating/controllers/product-rating.admin.controller';
import { ProductRatingModule } from 'src/modules/product-rating/product-rating.module';
import { ImageAdminController } from 'src/modules/image/controllers/image.admin.controller';
import { ImageModule } from 'src/modules/image/image.module';
import { CartAdminController } from 'src/modules/cart/controllers/cart.admin.controller';
import { CartModule } from 'src/modules/cart/cart.module';
import { CartItemModule } from 'src/modules/cart-item/cart-item.module';
import { CartItemAdminController } from 'src/modules/cart-item/controllers/cart-item.admin.controller';
import { ShippingAddressModule } from 'src/modules/shipping-address/shipping-address.module';
import { ShippingAddressAdminController } from 'src/modules/shipping-address/controllers/shipping-address.admin.controller';
import { OrderModule } from 'src/modules/order/order.module';
import { OrderAdminController } from 'src/modules/order/controllers/order.admin.controller';
import { OrderItemModule } from 'src/modules/order-item/order-item.module';
import { OrderItemAdminController } from 'src/modules/order-item/controllers/order-item.admin.controller';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { PaymentController } from 'src/modules/payment/controllers/payment.user.controller';
import { WishlistModule } from 'src/modules/wishlist/wishlist.module';
import { WishlistAdminController } from 'src/modules/wishlist/controllers/wishlist.admin.controller';
// import { PaymentModule } from 'src/modules/payment/payment.module';
// import { PaymentPublicUserController } from 'src/modules/payment/controller/payment.public-user.controller';

@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    OtpModule,
    CategoryModule,
    ProductsModule,
    ProductVariantsModule,
    ProductRatingModule,
    ImageModule,
    CartModule,
    CartItemModule,
    ShippingAddressModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
    WishlistModule,
  ],
  controllers: [
    PaymentController,
    AdminUserController,
    AuthAdminController,
    CategoryAdminController,
    ProductAdminController,
    ProductRatingAdminController,
    ProductVarientsAdminController,
    ImageAdminController,
    OrderAdminController,
    CartAdminController,
    CartItemAdminController,
    ShippingAddressAdminController,
    OrderItemAdminController,
    WishlistAdminController,
  ],
})
export class AdminRouterModule {}
