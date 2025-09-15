import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, UpdateResult } from 'typeorm';
import { ProductRepository } from '../repositories/product.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductCreateDto } from '../dto/create-product.dto';
import { IProductUpdateDto } from '../interfaces/product.update.dto.interface';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
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
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { ProductVariantService } from 'src/modules/product-variants/services/product-variant.service';
import { ProductVariantCreateDto } from 'src/modules/product-variants/dto/create-product-variant.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly _productRepo: ProductRepository,
    private readonly _variantService: ProductVariantService,
  ) {}

  async create(
    createDto: ProductCreateDto,
    options?: ICreateOptions,
  ): Promise<ProductEntity> {
    const { variants, ...productData } = createDto;

    const product = await this._productRepo._create(productData, options);

    if (variants && variants.length > 0) {
      for (const variantData of variants) {
        const variantDto = new ProductVariantCreateDto();
        variantDto.dimensions = variantData.dimensions;
        variantDto.color = variantData.color;
        variantDto.productId = product.id;

        await this._variantService.create(variantDto);
      }
    }

    return product;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ProductEntity>,
  ): Promise<ProductEntity | null> {
    return await this._productRepo._findOneById(id, options);
  }

  async fetchProduct(id: number): Promise<ProductEntity | null> {
    return this._productRepo._findOneById(id, {
      options: {
        select: {
          variants: { id: true, color: true, dimensions: true, price: true},
        },
        relations: {
          variants: true,
          category: {
            parent: true,
            children: true,
          },
        },
      },
    });
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

  getQueryBuilder(name: string): SelectQueryBuilder<ProductEntity> {
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
}
