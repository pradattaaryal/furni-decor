import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
 import { AuthUserController } from 'src/modules/authentication/controllers/auth.user.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryUserController } from 'src/modules/category/controllers/category.publicuser.controller';
import { ProductsModule } from 'src/modules/products/products.module';
import { ProductUserController } from 'src/modules/products/controllers/product.user.controller';
import { ProductVariantsModule } from 'src/modules/product-variants/product-variants.module';
import { ProductVarientsUserController } from 'src/modules/product-variants/controllers/product-variant.user.controller';
import { ProductRatingUserController } from 'src/modules/product-rating/controllers/product-rating.user.controller';
import { ProductRatingModule } from 'src/modules/product-rating/product-rating.module';
import { ImageUserController } from 'src/modules/image/controllers/image.user.controller';
import { ImageModule } from 'src/modules/image/image.module';
import { CartUserController } from 'src/modules/cart/controllers/cart.user.controller';
import { CartModule } from 'src/modules/cart/cart.module';
import { CartItemModule } from 'src/modules/cart-item/cart-item.module';
import { CartItemUserController } from 'src/modules/cart-item/controllers/cart-item.user.controller';
import { ShippingAddressModule } from 'src/modules/shipping-address/shipping-address.module';
import { ShippingAddressUserController } from 'src/modules/shipping-address/controllers/shipping-address.user.controller';
import { OrderModule } from 'src/modules/order/order.module';
import { OrderUserController } from 'src/modules/order/controllers/order.user.controller';
import { OrderItemModule } from 'src/modules/order-item/order-item.module';
import { OrderItemUserController } from 'src/modules/order-item/controllers/order-item.user.controller';
import { WishlistModule } from 'src/modules/wishlist/wishlist.module';
import { WishlistUserController } from 'src/modules/wishlist/controllers/wishlist.user.controller';
import { PaymentModule } from 'src/modules/payment/payment.module';
 import { BlogUserController } from 'src/modules/blog/controllers/blog.user.controller';
import { BlogModule } from 'src/modules/blog/blog.module';
import { BlogCategoryModule } from 'src/modules/blog-category/blog-category.module';
import { BlogCategoryUserController } from 'src/modules/blog-category/controllers/blog-category.user.controller';
import { ColorModule } from 'src/modules/color/color.module';
import { ColorUserController } from 'src/modules/color/controllers/color.user.controller';
import { BillingAddressModule } from 'src/modules/billing-address/billing-address.module';
import { BillingAddressUserController } from 'src/modules/billing-address/controllers/billing-address.user.controller';
import { HomePageBannerModule } from 'src/modules/home-page-banner/home-page-banner.module';
import { HomePageBannerUserController } from 'src/modules/home-page-banner/controllers/home-page-banner.user.controller';
import { PaymentUserController } from 'src/modules/payment/controllers/payment.user.controller';
import { PublicUserController } from 'src/modules/user/controllers/user.controller';

@Module({
  imports: [
    UserModule,
    BlogModule,
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
    BlogCategoryModule,
    ColorModule,
    BillingAddressModule,
    HomePageBannerModule,
  ],
  controllers: [
    PublicUserController,
    AuthUserController,
    BillingAddressUserController,
    BlogUserController,
    BlogCategoryUserController,
    CartUserController,
    CartItemUserController,
    CategoryUserController,
    ColorUserController,
    HomePageBannerUserController,
    ImageUserController,
    OrderUserController,
    OrderItemUserController,
    PaymentUserController,
    ProductUserController,
    ProductRatingUserController,
    ProductVarientsUserController,
    ShippingAddressUserController,
    WishlistUserController,
  ],
})
export class UserRouterModule {}
