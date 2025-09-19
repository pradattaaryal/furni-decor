import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartItemRepository } from '../repositories/cart-item.repository';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CreateCartItemDto } from '../dto/cart-item.create.dto';
import { CartItemUpdateDto } from '../dto/cart-item.update.dto';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
} from 'src/common/database/interfaces/findOption.interface';
import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { ProductVariantRepository } from 'src/modules/product-variants/repositories/product-variant.repository';
import { ProductVariantService } from 'src/modules/product-variants/services/product-variant.service';
import { ProductService } from 'src/modules/products/services/product.service';
import { CartService } from 'src/modules/cart/services/cart.service';

@Injectable()
export class CartItemService {
  constructor(
    private readonly _cartItemRepo: CartItemRepository,
    private readonly _productVariantService: ProductVariantService,
    private readonly _productService: ProductService,
    private readonly _cartService: CartService,
  ) {}

  async create(
    createDto: CreateCartItemDto,
    options?: ICreateOptions,
  ): Promise<CartItemEntity> {
    try {
      const { cartId, productId, variantId, quantity, price } = createDto;

      // Validate cart
      const cart = await this._cartService.getById(cartId);
      if (!cart) {
        throw new BadRequestException(`Cart with ID ${cartId} not found`);
      }

      // Validate product
      const product = await this._productService.getById(productId);
      if (!product) {
        throw new BadRequestException(`Product with ID ${productId} not found`);
      }

      // Validate variant (if provided)
      let variant ;
      if (variantId) {
        variant = await this._productVariantService.getById(variantId);
        if (!variant) {
          throw new BadRequestException(
            `Product variant with ID ${variantId} not found`,
          );
        }
      }

      // Map to entity object
      const cartItemData: Partial<CartItemEntity> = {
        cart,
        cartId: cart.id,
        product,
        productId: product.id,
        variant: variant,
        variantId: variant?.id,
        quantity,
        price,
      };

      // Persist via repo
      return await this._cartItemRepo._create(cartItemData, options);
    } catch (error) {
      // You can log here with a logger/DebuggerService if you want
      console.error('Error while creating cart item:', error);

      // Re-throw so NestJS exception filter handles it properly
      throw error;
    }
  }

  async getById(
    id: number,
    options?: IFindOneOptions<CartItemEntity>,
  ): Promise<CartItemEntity | null> {
    return await this._cartItemRepo._findOneById(id, options);
  }

  async getAll(
    options?: IFindAllOptions<CartItemEntity>,
  ): Promise<CartItemEntity[]> {
    return await this._cartItemRepo._findAll(options);
  }

  async update(
    entity: CartItemEntity,
    updateDto: CartItemUpdateDto,
    options?: IUpdateOptions<CartItemEntity>,
  ): Promise<CartItemEntity> {
    Object.assign(entity, updateDto);
    return await this._cartItemRepo._update(entity, options);
  }

  async softDelete(
    entity: CartItemEntity,
    options?: IUpdateOptions<CartItemEntity>,
  ): Promise<CartItemEntity> {
    return await this._cartItemRepo._softDelete(entity, options);
  }

  async delete(
    entity: CartItemEntity,
    options?: IDeleteOptions<CartItemEntity>,
  ): Promise<CartItemEntity> {
    return await this._cartItemRepo._delete(entity, options);
  }
}
