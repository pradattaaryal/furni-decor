import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, UpdateResult } from 'typeorm';
import { ProductRepository } from '../repositories/product.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductCreateDto } from '../dto/create-product.dto';
import { IProductUpdateDto } from '../interfaces/product.update.dto.interface';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { IFindAllOptions, IFindOneOptions, IPaginateFindOption, IPaginateQueryBuilderOption } from 'src/common/database/interfaces/findOption.interface';
import { IUpdateOptions, IUpdateRawOptions } from 'src/common/database/interfaces/updateOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';

@Injectable()
export class ProductService {
  constructor(private readonly _productRepo: ProductRepository) {}

  async create(
    createDto: ProductCreateDto,
    options?: ICreateOptions,
  ): Promise<ProductEntity> {
    return await this._productRepo._create(createDto, options);
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ProductEntity>,
  ): Promise<ProductEntity | null> {
    return await this._productRepo._findOneById(id, options);
  }

  async getOne(
    options: IFindOneOptions<ProductEntity>,
  ): Promise<ProductEntity | null> {
    return await this._productRepo._findOne(options);
  }

  async getOneOrFail(
    options: IFindOneOptions<ProductEntity>,
  ): Promise<ProductEntity> {
    const product = await this._productRepo._findOne(options);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getAll(
    options?: IFindAllOptions<ProductEntity>,
  ): Promise<ProductEntity[]> {
    return await this._productRepo._findAll(options);
  }

  getQueryBuilder(
    name: string
  ): SelectQueryBuilder<ProductEntity> {
    return this._productRepo.getRepo().createQueryBuilder(name);
  }

  async paginatedGet(options?: IPaginateFindOption<ProductEntity>): Promise<{
    data: ProductEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._productRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: ProductEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._productRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    product: ProductEntity,
    options?: IUpdateOptions<ProductEntity>,
  ): Promise<ProductEntity> {
    return await this._productRepo._softDelete(product, options);
  }

  async delete(
    product: ProductEntity,
    options?: IDeleteOptions<ProductEntity>,
  ): Promise<ProductEntity> {
    return await this._productRepo._delete(product, options);
  }

  async restore(
    options: IUpdateRawOptions<ProductEntity>,
  ): Promise<UpdateResult | null> {
    return await this._productRepo._restoreRaw(options);
  }

  async update(
    product: ProductEntity,
    updateData: IProductUpdateDto,
    options?: IUpdateOptions<ProductEntity>,
  ) {
    Object.assign(product, updateData);
    return await this._productRepo._update(product, options);
  }

  async fetchProductByName(name: string): Promise<ProductEntity[]> {
    return this._productRepo.fetchProductByName(name);
  }

  async fetchProduct(id: number): Promise<ProductEntity | null> {
    return this._productRepo.fetchProduct(id);
  }

  async updateProduct(id: number, data: Partial<ProductEntity>): Promise<ProductEntity | null> {
    return this._productRepo.updateProduct(id, data);
  }

  async getProductsByCategory(categoryId: number): Promise<ProductEntity[]> {
    return this._productRepo.getProductsByCategory(categoryId);
  }
}
