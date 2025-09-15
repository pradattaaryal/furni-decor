import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, UpdateResult } from 'typeorm';
import { ProductVariantRepository } from '../repositories/product-variant.repository';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductVariantCreateDto } from '../dto/create-product-variant.dto';
import { IProductVariantUpdateDto } from '../interfaces/product-variant.update.dto.interface';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from 'src/common/database/interfaces/findOption.interface';
import { IUpdateOptions, IUpdateRawOptions } from 'src/common/database/interfaces/updateOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';

@Injectable()
export class ProductVariantService {
  constructor(private readonly _variantRepo: ProductVariantRepository) {}

  async create(createDto: ProductVariantCreateDto, options?: ICreateOptions): Promise<ProductVariantEntity> {
    return await this._variantRepo._create(createDto, options);
  }

  async getById(id: number, options?: IFindOneOptions<ProductVariantEntity>): Promise<ProductVariantEntity | null> {
    return await this._variantRepo._findOneById(id, options);
  }

  async getOne(options: IFindOneOptions<ProductVariantEntity>): Promise<ProductVariantEntity | null> {
    return await this._variantRepo._findOne(options);
  }

  async getAll(options?: IFindAllOptions<ProductVariantEntity>): Promise<ProductVariantEntity[]> {
    return await this._variantRepo._findAll(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<ProductVariantEntity> {
    return this._variantRepo.getRepo().createQueryBuilder(name);
  }

  async paginatedGet(options?: IPaginateFindOption<ProductVariantEntity>): Promise<{ data: ProductVariantEntity[]; _pagination: IPaginationMeta }> {
    return await this._variantRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(options: IPaginateQueryBuilderOption): Promise<{ data: ProductVariantEntity[]; _pagination: IPaginationMeta }> {
    return await this._variantRepo._paginatedQueryBuilder(options);
  }

  async softDelete(variant: ProductVariantEntity, options?: IUpdateOptions<ProductVariantEntity>): Promise<ProductVariantEntity> {
    return await this._variantRepo._softDelete(variant, options);
  }

  async delete(variant: ProductVariantEntity, options?: IDeleteOptions<ProductVariantEntity>): Promise<ProductVariantEntity> {
    return await this._variantRepo._delete(variant, options);
  }

  async restore(options: IUpdateRawOptions<ProductVariantEntity>): Promise<UpdateResult | null> {
    return await this._variantRepo._restoreRaw(options);
  }

  async update(variant: ProductVariantEntity, updateData: IProductVariantUpdateDto, options?: IUpdateOptions<ProductVariantEntity>) {
    Object.assign(variant, updateData);
    return await this._variantRepo._update(variant, options);
  }
} 