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
import { ProductVariantService } from 'src/modules/product-variants/services/product-variant.service';
import { ProductService } from 'src/modules/products/services/product.service';
import { CartService } from 'src/modules/cart/services/cart.service';
import { ICartItemEntity } from '../interfaces/cart-item.entity.interface';
import { CartItemQuantityDto } from '../dto/cart-item.increment.dto';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { use } from 'passport';

@Injectable()
export class CartItemService {
  constructor(
    private readonly _cartItemRepo: CartItemRepository,
    private readonly _productVariantService: ProductVariantService,
    private readonly _productService: ProductService,
    private readonly _cartService: CartService,
    private readonly _userService: UserService,
  ) {}

  async create(
    userId: number,
    createDto: CreateCartItemDto,
    options?: ICreateOptions,
  ): Promise<CartItemEntity> {
    try {
      const { productId, variantId, quantity } = createDto;

      const user = await this._userService.getById(userId, {
        options: { relations: { cart: true } },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!user.cart?.id) {
        throw new BadRequestException('Cart ID is undefined');
      }
      const cart = await this._cartService.getById(user.cart.id);
      if (!cart) {
        throw new BadRequestException(`Cart with ID ${user.cart.id} not found`);
      }
      const product = await this._productService.getById(productId);
      if (!product) {
        throw new BadRequestException(`Product with ID ${productId} not found`);
      }

      let variant;
      if (variantId) {
        variant = await this._productVariantService.getById(variantId);
        if (!variant) {
          throw new BadRequestException(
            `Product variant with ID ${variantId} not found`,
          );
        }
      }
      if (product.quantity < 0) {
        throw new BadRequestException(
          `Product ${product.id} out of stock found`,
        );
      }
      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;
      cart.totalPrice = (cart.totalPrice || 0) + totalPrice;
      await this._cartService.update(
        { cartId: cart.id, totalPrice: cart.totalPrice },
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
    entity: ICartItemEntity,
    options?: IUpdateOptions<CartItemEntity>,
  ) {
    const cart = await this._cartService.getById(entity.cartId);
    if (!cart) {
      throw new BadRequestException(`Cart with ID ${entity.cartId} not found`);
    }
    const product = await this._productService.getById(entity.productId);
    if (!product) {
      throw new BadRequestException(
        `Product with ID ${entity.productId} not found`,
      );
    }

    let variant;
    if (entity.variantId) {
      variant = await this._productVariantService.getById(entity.variantId);
      if (!variant) {
        throw new BadRequestException(
          `Product variant with ID ${entity.variantId} not found`,
        );
      }
    }
    if (variant.quantity < 0) {
      throw new BadRequestException(
        `Product variant with ID ${entity.variantId} out of stock found`,
      );
    }
    const unitPrice = product.price;
    const totalPrice = unitPrice * entity.quantity;
    cart.totalPrice = (cart.totalPrice || 0) - totalPrice;
    await this._cartService.update(
      { cartId: cart.id, totalPrice: cart.totalPrice },
      options,
    );
    return totalPrice;
  }

  async paginatedGet(options?: IPaginateFindOption<CartItemEntity>): Promise<{
    data: CartItemEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._cartItemRepo._paginateFind(options);
  }

  async update(
    id: number,
    updateDto: CartItemUpdateDto,
    options?: IUpdateOptions<CartItemEntity>,
  ): Promise<CartItemEntity> {
    try {
      const existing = await this.getById(id, options);
      if (!existing) {
        throw new NotFoundException(`Cart item with ID ${id} not found`);
      }

      const cart = await this._cartService.getById(existing.cartId);
      if (!cart) {
        throw new BadRequestException(
          `Cart with ID ${existing.cartId} not found`,
        );
      }

      const oldTotal = cart.totalPrice;
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

      await this._cartService.update(
        { cartId: cart.id, totalPrice: cart.totalPrice },
        options,
      );

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

  async incrementQuantity(
    cartItemId: number,
    incrementDto: CartItemQuantityDto,
    options?: IUpdateOptions<CartItemEntity>,
  ): Promise<CartItemEntity> {
    const cartItem = await this.getById(cartItemId, options);
    if (!cartItem)
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);

    const product = await this._productService.getById(cartItem.productId);
    if (!product)
      throw new BadRequestException(
        `Product with ID ${cartItem.productId} not found`,
      );

    let variant;
    if (cartItem.variantId) {
      variant = await this._productVariantService.getById(cartItem.variantId);
      if (!variant)
        throw new BadRequestException(
          `Product variant with ID ${cartItem.variantId} not found`,
        );

      if (variant.quantity < cartItem.quantity + incrementDto.quantity) {
        throw new BadRequestException(
          `Not enough stock for variant ID ${variant.id}`,
        );
      }
    }

    cartItem.quantity += incrementDto.quantity;

    const totalIncrease = product.price * incrementDto.quantity;
    const cart = await this._cartService.getById(cartItem.cartId);
    if (!cart) {
      throw new BadRequestException('cart not found');
    }
    cart.totalPrice = cart.totalPrice + totalIncrease;

    await this._cartService.update(
      { cartId: cart.id, totalPrice: cart.totalPrice },
      options,
    );

    return await this._cartItemRepo._update(cartItem, options);
  }

  async decrementQuantity(
    cartItemId: number,
    decrementDto: CartItemQuantityDto,
    options?: IUpdateOptions<CartItemEntity>,
  ): Promise<CartItemEntity | null> {
    const cartItem = await this.getById(cartItemId, options);
    if (!cartItem)
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);

    const product = await this._productService.getById(cartItem.productId);
    if (!product)
      throw new BadRequestException(
        `Product with ID ${cartItem.productId} not found`,
      );

    if (decrementDto.quantity >= cartItem.quantity) {
      await this._cartItemRepo._delete(cartItem, options);

      const cart = await this._cartService.getById(cartItem.cartId);
      if (!cart) {
        throw new BadRequestException('cart not found');
      }
      cart.totalPrice =
        (cart.totalPrice || 0) - product.price * cartItem.quantity;
      await this._cartService.update(
        { cartId: cart.id, totalPrice: cart.totalPrice },
        options,
      );

      return null;
    } else {
      cartItem.quantity -= decrementDto.quantity;

      const cart = await this._cartService.getById(cartItem.cartId);
      if (!cart) {
        throw new BadRequestException('cart not found');
      }
      cart.totalPrice =
        (cart.totalPrice || 0) - product.price * decrementDto.quantity;
      await this._cartService.update(
        { cartId: cart.id, totalPrice: cart.totalPrice },
        options,
      );

      return await this._cartItemRepo._update(cartItem, options);
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
    await this.recalculateCartTotal(entity, options);
    return await this._cartItemRepo._delete(entity, options);
  }

  async bulksoftDelete(
    cartitem: CartItemEntity,
    options?: IUpdateOptions<CartItemEntity>,
  ) {
    return await this._cartItemRepo._softDeleteRaw({
      where: { cartId: cartitem.cartId },
    });
  }
}
