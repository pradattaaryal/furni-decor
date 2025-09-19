import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from 'src/common/database/interfaces/findOption.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { SelectQueryBuilder, UpdateResult } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { CartRepository } from '../repositories/cart.repository';
import { CreateCartDto } from '../dto/cart.create.dto';
import { IUpdateCartDto } from '../interfaces/cart.update.dto.interface';
import { UpdateCartDto } from '../dto/cart.update.dto';

@Injectable()
export class CartService {
  constructor(private readonly _cartRepo: CartRepository) {}

  async create(
    createDto: CreateCartDto,
    options?: ICreateOptions,
  ): Promise<CartEntity> {
    const data = await this._cartRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<CartEntity>,
  ): Promise<CartEntity | null> {
    const data = await this._cartRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<CartEntity>,
  ): Promise<CartEntity | null> {
    const data = await this._cartRepo._findOne(options);
    return data;
  }

  async getOneOrFail(
    options: IFindOneOptions<CartEntity>,
  ): Promise<CartEntity> {
    const data = await this.getOne(options);
    if (!data) {
      throw new NotFoundException('Cannot find Cart');
    }
    return data;
  }

  async getAll(options?: IFindAllOptions<CartEntity>): Promise<CartEntity[]> {
    return await this._cartRepo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<CartEntity>): Promise<{
    data: CartEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._cartRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: CartEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._cartRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    category: CartEntity,
    options?: IUpdateOptions<CartEntity>,
  ): Promise<CartEntity> {
    return await this._cartRepo._softDelete(category, options);
  }

  async delete(
    category: CartEntity,
    options?: IDeleteOptions<CartEntity>,
  ): Promise<CartEntity> {
    return await this._cartRepo._delete(category, options);
  }

  async restore(
    options: IUpdateRawOptions<CartEntity>,
  ): Promise<UpdateResult | null> {
    return await this._cartRepo._restoreRaw(options);
  }

  async update(updateData: IUpdateCartDto, options?: IUpdateOptions<CartEntity>): Promise<CartEntity> {
    // Validate input
    if (!updateData.cartId) {
      throw new BadRequestException('cartId is required');
    }

    // Fetch cart
    const cart = await this._cartRepo._findOneById(updateData.cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${updateData.cartId} not found`);
    }

    // Update allowed fields
    const { totalPrice } = updateData;
    if (totalPrice !== undefined) {
      if (totalPrice < 0) throw new BadRequestException('totalPrice cannot be negative');
      cart.totalPrice = totalPrice;
    }

    // Persist changes
    return await this._cartRepo._update(cart, options);
  }
}
