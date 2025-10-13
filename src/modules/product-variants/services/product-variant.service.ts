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
import { ColorRepository } from 'src/modules/color/repositories/color.repository';
import { ImageRepository } from 'src/modules/image/repositories/image.repository';
import { ProductRepository } from 'src/modules/products/repositories/product.repository';
import { SelectQueryBuilder, UpdateResult } from 'typeorm';
import { ProductVariantCreateDto } from '../dto/product-variant.create.dto';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { IProductVariantUpdateDto } from '../interfaces/product-variant.update.dto.interface';
import { ProductVariantRepository } from '../repositories/product-variant.repository';

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly _variantRepo: ProductVariantRepository,
    private readonly _imageRepo: ImageRepository,
    private readonly _productRepo: ProductRepository,
    private readonly _colorRepo: ColorRepository,
  ) { }

  async create(
    createDto: ProductVariantCreateDto,
    options?: ICreateOptions,
  ): Promise<ProductVariantEntity> {
    try {
      if (!createDto.productId) {
        throw new BadRequestException('productId is required');
      }

      const product = await this._productRepo._findOneById(createDto.productId);
      if (!product) {
        throw new NotFoundException(`Product with id ${createDto.productId} not found`);
      }

      const image = createDto.imageId
        ? await this._imageRepo._findOneById(createDto.imageId)
        : null;

      const color = createDto.colorId
        ? await this._colorRepo._findOneById(createDto.colorId)
        : null;

 
      const variant = new ProductVariantEntity();
      variant.product = product
      variant.color = color;
      variant.image=image;
      console.log(variant);
      return await this._variantRepo._create(variant, options);
    } catch (error) {
      throw error;
    }
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ProductVariantEntity>,
  ): Promise<ProductVariantEntity | null> {
    return await this._variantRepo._findOneById(id, options);
  }

  async getOne(
    options: IFindOneOptions<ProductVariantEntity>,
  ): Promise<ProductVariantEntity | null> {
    return await this._variantRepo._findOne(options);
  }

  async getAll(
    options?: IFindAllOptions<ProductVariantEntity>,
  ): Promise<ProductVariantEntity[]> {
    return await this._variantRepo._findAll(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<ProductVariantEntity> {
    return this._variantRepo.getRepo().createQueryBuilder(name);
  }

  async paginatedGet(
    options?: IPaginateFindOption<ProductVariantEntity>,
  ): Promise<{ data: ProductVariantEntity[]; _pagination: IPaginationMeta }> {
    return await this._variantRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{ data: ProductVariantEntity[]; _pagination: IPaginationMeta }> {
    return await this._variantRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    variant: ProductVariantEntity,
    options?: IUpdateOptions<ProductVariantEntity>,
  ): Promise<ProductVariantEntity> {
    return await this._variantRepo._softDelete(variant, options);
  }

  async delete(
    variant: ProductVariantEntity,
    options?: IDeleteOptions<ProductVariantEntity>,
  ): Promise<ProductVariantEntity> {
    return await this._variantRepo._delete(variant, options);
  }

  async restore(
    options: IUpdateRawOptions<ProductVariantEntity>,
  ): Promise<UpdateResult | null> {
    return await this._variantRepo._restoreRaw(options);
  }

  async update(
    variant: ProductVariantEntity,
    updateData: IProductVariantUpdateDto,
    options?: IUpdateOptions<ProductVariantEntity>,
  ) {
    try {
      if (updateData.productId !== undefined) {
        const product = await this._productRepo._findOneById(updateData.productId);
        if (!product) {
          throw new NotFoundException(`Product with id ${updateData.productId} not found`);
        }
        variant.product = product;
      }

      if (updateData.imageId !== undefined) {
        if (updateData.imageId === null) {
          variant.image = null;
        } else {
          const image = await this._imageRepo._findOneById(updateData.imageId);
          if (!image) {
            throw new NotFoundException(`Image with id ${updateData.imageId} not found`);
          }
          variant.image = image;
        }
      }

      if (updateData.colorId !== undefined) {
        if (updateData.colorId === null) {
          variant.color = null;
        } else {
          const color = await this._colorRepo._findOneById(updateData.colorId);
          if (!color) {
            throw new NotFoundException(`Color with id ${updateData.colorId} not found`);
          }
          variant.color = color;
        }
      }

      return await this._variantRepo._update(variant, options);
    } catch (error) {
      throw error;
    }
  }
}
