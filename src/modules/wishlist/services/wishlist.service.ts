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
import { ICreateWishlist } from '../interfaces/wishlist.create.dto.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';

@Injectable()
export class WishlistService {
  constructor(
    private readonly _wishlistRepository: WishlistRepository,
    private readonly _userRepository: UserRepository,
    private readonly _productRepository: ProductRepository,
  ) {}

  async create(
    createData: ICreateWishlist,
    options?: ICreateOptions,
  ): Promise<WishlistEntity> {
    try {
      const { userId, productId } = createData;

      // Validate user existence
      const user = await this._userRepository._findOneById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Validate product existence
      const product = await this._productRepository._findOneById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      // Check for existing wishlist entry
      const existingWishlist = await this.getOne({
        options: {
          where: { user, product },
        },
      });
      if (existingWishlist) {
        throw new BadRequestException('Product already in wishlist');
      }

      const entity: Partial<WishlistEntity> = {
        user,
        product,
        userId: user.id,
        productId: product.id,
      };

      return await this._wishlistRepository._create(entity, options);
    } catch (error) {
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
