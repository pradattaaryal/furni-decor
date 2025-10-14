import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WishlistRepository } from '../repositories/wishlist.repository';
import { WishlistEntity } from '../entities/wishlist.entity';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
} from 'src/common/database/interfaces/findOption.interface';
import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';

import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { ProductRepository } from 'src/modules/products/repositories/product.repository';
import { ProductVariantRepository } from 'src/modules/product-variants/repositories/product-variant.repository';
import { ICreateWishlist } from '../interfaces/wishlist.create.dto.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { ProductVariantEntity } from 'src/modules/product-variants/entities/product-variant.entity';

@Injectable()
export class WishlistService {
  constructor(
    private readonly _wishlistRepository: WishlistRepository,
    private readonly _userRepository: UserRepository,
    private readonly _productRepository: ProductRepository,
    private readonly _productVariantRepository: ProductVariantRepository,
  ) { }

  async create(
    createData: ICreateWishlist,
    options?: ICreateOptions,
  ): Promise<WishlistEntity> {
    try {
      const { userId, productId, variantId } = createData;


      const user = await this._userRepository._findOneById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const product = await this._productRepository._findOneById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const variant = variantId
        ? await this._productVariantRepository._findOneById(variantId)
        : null;
      if (!variant) {
        throw new NotFoundException(
          `Product variant with ID ${variantId} not found`,
        );
      }


      const existingWishlist = await this._wishlistRepository._findOne({
        options: {
          where: {
            userId: user.id,
            productId: productId,
            variantId: variantId
          },
        },
      });

      if (existingWishlist) {
        throw new BadRequestException(
          'Product (with variant) already in wishlist',
        );
      }

      const entity: Partial<WishlistEntity> = {
        user,
        product,
        userId: user.id,
        productId: product.id,
        variantId: variantId,
        variant: variant || null,
      };

      return await this._wishlistRepository._create(entity, options);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to add product to wishlist');
    }
  }
  async getOne(
    options: IFindOneOptions<WishlistEntity>,
  ): Promise<WishlistEntity | null> {
    const data = await this._wishlistRepository._findOne(options);
    return data;
  }

  async paginatedGet(options?: IPaginateFindOption<WishlistEntity>): Promise<{
    data: WishlistEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._wishlistRepository._paginateFind(options);
  }

  async getAll(
    userId: number,
    options?: IFindAllOptions<WishlistEntity>,
  ): Promise<WishlistEntity[]> {
    return await this._wishlistRepository._findAll(options);
  }

  async getById(
    id: number,
    options?: IFindOneOptions<WishlistEntity>,
  ): Promise<WishlistEntity> {
    const wishlist = await this._wishlistRepository._findOneById(id, options);
    if (!wishlist) {
      throw new NotFoundException(`Wishlist entry with ID ${id} not found`);
    }
    return wishlist;
  }

  async remove(
    wishlistId: string,
    options?: IUpdateOptions<WishlistEntity>,
  ): Promise<WishlistEntity> {
    const id = parseInt(wishlistId, 10);

    const wishlist = await this.getById(id, options);
    if (!wishlist) {
      throw new NotFoundException(`Wishlist entry with ID ${id} not found`);
    }

    return await this._wishlistRepository._delete(wishlist, options);
  }

  async delete(
    id: number,
    options?: IUpdateOptions<WishlistEntity>,
  ): Promise<WishlistEntity> {
    const wishlist = await this.getById(id, options);
    return await this._wishlistRepository._softDelete(wishlist, options);
  }
}
