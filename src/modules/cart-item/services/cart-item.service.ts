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
  IPaginateFindOption,
} from 'src/common/database/interfaces/findOption.interface';
import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { ProductVariantRepository } from 'src/modules/product-variants/repositories/product-variant.repository';
import { ProductVariantService } from 'src/modules/product-variants/services/product-variant.service';
import { ProductService } from 'src/modules/products/services/product.service';
import { CartService } from 'src/modules/cart/services/cart.service';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { CartRepository } from 'src/modules/cart/repositories/cart.repository';

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
      let variant;
      if (variantId) {
        variant = await this._productVariantService.getById(variantId);
        if (!variant) {
          throw new BadRequestException(
            `Product variant with ID ${variantId} not found`,
          );
        }
      }
      // valadation for stock quantity
      if (variant.quantity < 0) {
        throw new BadRequestException(
          `Product variant with ID ${variantId} out of stock found`,
        );
      }
      // Calculate total price for this cart item
      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;
      cart.totalPrice = (cart.totalPrice || 0) + totalPrice;
      await this._cartService.update(
        { cartId: cart.id, totalPrice: cart.totalPrice }, // IUpdateCartDto
        options,
      );
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

      return await this._cartItemRepo._create(cartItemData, options);
    } catch (error) {
      console.error('Error while creating cart item:', error);

      throw error;
    }
  }
  async getAllByCartId(
    cartId: number,
    options?: IFindAllOptions<CartItemEntity>,
  ): Promise<CartItemEntity[]> {
    const items = await this._cartItemRepo._findAll({
      options: {
        where: { cartId },
        relations: { product: true, variant: true },
      },
    });

    return items;
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
  async recalculateCartTotal(
    cartId: number,
    options?: IUpdateOptions<CartItemEntity>,
  ): Promise<number> {
    // Fetch cart
    const cart = await this._cartService.getById(cartId, options);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    // Fetch all items in the cart
    const items = await this._cartItemRepo._findAll({
      options: {
        where: { cartId },
        relations: { product: true, variant: true },
      },
    });

    if (!items || items.length === 0) {
      cart.totalPrice = 0;
      await this._cartService.update(
        { cartId: cart.id, totalPrice: 0 },
        options,
      );
      return 0;
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const unitPrice = item.product?.price;
      totalPrice += unitPrice * item.quantity;
    }

    // Update cart total
    cart.totalPrice = totalPrice;
    await this._cartService.update(
      { cartId: cart.id, totalPrice: totalPrice },
      options,
    );

    return totalPrice;
  }

 
  async update(
    id: number,
    updateDto: CartItemUpdateDto,
    options?: IUpdateOptions<CartItemEntity>,
  ): Promise<CartItemEntity> {
    try {
      // Fetch existing cart item
      const existing = await this.getById(id, options);
      if (!existing) {
        throw new NotFoundException(`Cart item with ID ${id} not found`);
      }

      // Validate cart
      const cart = await this._cartService.getById(existing.cartId);
      if (!cart) {
        throw new BadRequestException(
          `Cart with ID ${existing.cartId} not found`,
        );
      }

      // Recalculate cart total: subtract old, add new
      const oldTotal = existing.price * existing.quantity;
      const product = await this._productService.getById(existing.productId);
      if (!product) {
        throw new BadRequestException(
          `Product with ID ${existing.productId} not found`,
        );
      }

      const newQuantity = updateDto.quantity ?? existing.quantity;
      const unitPrice = product.price;
      const newTotal = unitPrice * newQuantity;

      cart.totalPrice = (cart.totalPrice || 0) - oldTotal + newTotal;

      // Update cart
      await this._cartService.update(
        { cartId: cart.id, totalPrice: cart.totalPrice },
        options,
      );

      // Apply updates on the cart item entity
      Object.assign(existing, {
        ...updateDto,
        price: unitPrice,
        quantity: newQuantity,
      });

      return await this._cartItemRepo._update(existing, options);
    } catch (error) {
      console.error('Error while updating cart item:', error);
      throw error;
    }
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
    await this.recalculateCartTotal(entity.cartId, options);
    return await this._cartItemRepo._delete(entity, options);
  }
}
