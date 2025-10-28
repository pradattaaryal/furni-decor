import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { AdminUserController } from 'src/modules/user/controllers/user.admin.controller';
import { AuthMarketingController } from 'src/modules/authentication/controllers/auth.marketing.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryMarketingController } from 'src/modules/category/controllers/category.marketing.controller';
import { ProductsModule } from 'src/modules/products/products.module';
import { ProductMarketingController } from 'src/modules/products/controllers/product.marketing.controller';
import { ProductVariantsModule } from 'src/modules/product-variants/product-variants.module';
import { ProductVarientsMarketingController } from 'src/modules/product-variants/controllers/product-variant.marketing.controller';
import { ProductRatingMarketingController } from 'src/modules/product-rating/controllers/product-rating.marketing.controller';
import { ProductRatingModule } from 'src/modules/product-rating/product-rating.module';
import { ImageAdminController } from 'src/modules/image/controllers/image.admin.controller';
import { ImageModule } from 'src/modules/image/image.module';
 import { CartModule } from 'src/modules/cart/cart.module';
import { CartItemModule } from 'src/modules/cart-item/cart-item.module';
import { CartItemMarketingController } from 'src/modules/cart-item/controllers/cart-item.marketing.controller';
import { ShippingAddressModule } from 'src/modules/shipping-address/shipping-address.module';
import { ShippingAddressMarketingController } from 'src/modules/shipping-address/controllers/shipping-address.marketing.controller';
import { OrderModule } from 'src/modules/order/order.module';
import { OrderMarketingController } from 'src/modules/order/controllers/order.marketing.controller';
import { OrderItemModule } from 'src/modules/order-item/order-item.module';
import { OrderItemMarketingController } from 'src/modules/order-item/controllers/order-item.marketing.controller';
import { WishlistModule } from 'src/modules/wishlist/wishlist.module';
import { WishlistMarketingController } from 'src/modules/wishlist/controllers/wishlist.marketing.controller';
import { PaymentModule } from 'src/modules/payment/payment.module';
 import { BlogMarketingController } from 'src/modules/blog/controllers/blog.marketing.controller';
import { BlogModule } from 'src/modules/blog/blog.module';
import { BlogCategoryModule } from 'src/modules/blog-category/blog-category.module';
import { BlogCategoryMarketingController } from 'src/modules/blog-category/controllers/blog-category.marketing.controller';
import { ColorModule } from 'src/modules/color/color.module';
import { ColorMarketingController } from 'src/modules/color/controllers/color.marketing.controller';
import { BillingAddressModule } from 'src/modules/billing-address/billing-address.module';
import { BillingAddressMarketingController } from 'src/modules/billing-address/controllers/billing-address.marketing.controller';
import { HomePageBannerModule } from 'src/modules/home-page-banner/home-page-banner.module';
import { HomePageBannerMarketingController } from 'src/modules/home-page-banner/controllers/home-page-banner.marketing.controller';
import { PaymentUserController } from 'src/modules/payment/controllers/payment.user.controller';
import { CartMarketingController } from 'src/modules/cart/controllers/cart.marketing.controller';

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
    AdminUserController,
    AuthMarketingController,
    BillingAddressMarketingController,
    BlogMarketingController,
    BlogCategoryMarketingController,
    CartMarketingController,
    CartItemMarketingController,
    CategoryMarketingController,
    ColorMarketingController,
    HomePageBannerMarketingController,
    ImageAdminController,
    OrderMarketingController,
    OrderItemMarketingController,
    PaymentUserController,
    ProductMarketingController,
    ProductRatingMarketingController,
    ProductVarientsMarketingController,
    ShippingAddressMarketingController,
    WishlistMarketingController,
  ],
})
export class MarketingRouterModule {}
