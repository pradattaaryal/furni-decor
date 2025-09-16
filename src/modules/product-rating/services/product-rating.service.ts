import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResult, SelectQueryBuilder } from 'typeorm';
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

import { ProductRatingEntity } from '../entities/product-rating.entity';
import { IProductRatingCreateDto } from '../interfaces/product-rating.create.dto.interface';
import { IProductRatingEntity } from '../interfaces/product-rating.entity.interface';
 import { ProductRepository } from 'src/modules/products/repositories/product.repository';
import { ProductRatingRepository } from '../repositories/product-rating.repository';
import { ProductService } from 'src/modules/products/services/product.service';

@Injectable()
export class ProductRatingService {
  constructor(
    private readonly _productRatingRepo: ProductRatingRepository,
    private readonly _productService: ProductService,  
  ) {}

  async create(
    createData: IProductRatingCreateDto,
    options?: ICreateOptions,
  ): Promise<ProductRatingEntity> {
    return this._productRatingRepo._create(createData, options);
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ProductRatingEntity>,
  ): Promise<ProductRatingEntity | null> {
    return this._productRatingRepo._findOneById(id, options);
  }

  async getOne(
    options: IFindOneOptions<ProductRatingEntity>,
  ): Promise<ProductRatingEntity | null> {
    return this._productRatingRepo._findOne(options);
  }

  async getOneOrFail(
    options: IFindOneOptions<ProductRatingEntity>,
  ): Promise<ProductRatingEntity> {
    const data = await this.getOne(options);
    if (!data) {
      throw new NotFoundException('Cannot find Product Rating');
    }
    return data;
  }

  async getAll(
    options?: IFindAllOptions<ProductRatingEntity>,
  ): Promise<ProductRatingEntity[]> {
    return this._productRatingRepo._findAll(options);
  }

  getQueryBuilder(
    alias: string,
  ): SelectQueryBuilder<ProductRatingEntity> {
    return this._productRatingRepo.getRepo().createQueryBuilder(alias);
  }

  async paginatedGet(
    options?: IPaginateFindOption<ProductRatingEntity>,
  ): Promise<{ data: ProductRatingEntity[]; _pagination: IPaginationMeta }> {
    return this._productRatingRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{ data: ProductRatingEntity[]; _pagination: IPaginationMeta }> {
    return this._productRatingRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    rating: ProductRatingEntity,
    options?: IUpdateOptions<ProductRatingEntity>,
  ): Promise<ProductRatingEntity> {
    return this._productRatingRepo._softDelete(rating, options);
  }

  async delete(
    rating: ProductRatingEntity,
    options?: IDeleteOptions<ProductRatingEntity>,
  ): Promise<ProductRatingEntity> {
    return this._productRatingRepo._delete(rating, options);
  }

  async restore(
    options: IUpdateRawOptions<ProductRatingEntity>,
  ): Promise<UpdateResult | null> {
    return this._productRatingRepo._restoreRaw(options);
  }

 

  async validateProduct(productId: number) {
    return this._productService.fetchProduct(productId);
  }

  
}
