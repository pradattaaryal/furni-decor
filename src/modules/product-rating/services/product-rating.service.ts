import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
import { IProductRatingUpdateDto } from '../interfaces/product-rating.update.dto.interface';
import { IProductRatingEntity } from '../interfaces/product-rating.entity.interface';
import { ProductRatingRepository } from '../repositories/product-rating.repository';
import { ProductService } from 'src/modules/products/services/product.service';

@Injectable()
export class ProductRatingService {
  constructor(
    private readonly _productRatingRepo: ProductRatingRepository,
    private readonly _productService: ProductService,
  ) {}

  async create(
    createData: { productId: number; userId: number; rating: number },
    options?: ICreateOptions,
  ): Promise<ProductRatingEntity> {
    // Validate product existence
    const product = await this._productService.getById(createData.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user has already rated the product
    const existingRating = await this._productRatingRepo._findOne({
      options: {
        where: {
          productId: createData.productId,
          userId: createData.userId,
        },
      },
    });

    if (existingRating) {
      throw new BadRequestException('User has already rated this product');
    }

    const createRating: IProductRatingEntity = {
      productId: createData.productId,
      userId: createData.userId,
      rating: createData.rating,
    };

    const newRating = await this._productRatingRepo._create(createRating, options);

    const oldCount = product.ratingCount;
    const newCount = oldCount + 1;
    const newAverage =
      (product.averageRating * oldCount + createData.rating) / newCount;


    await this._productService.update(product.id, {
      averageRating: parseFloat(newAverage.toFixed(1)),
      ratingCount: newCount,
    });


    return newRating;
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

  getQueryBuilder(alias: string): SelectQueryBuilder<ProductRatingEntity> {
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
    // Update product aggregates on soft delete
    const product = await this._productService.getById(rating.productId);
    if (product) {
      const oldCount = product.ratingCount || 0;
      const oldAverage = product.averageRating || 0;
      const newCount = Math.max(0, oldCount - 1);
      const newAverage =
        newCount === 0
          ? 0
          : (oldAverage * oldCount - rating.rating) / newCount;
      await this._productService.update(product.id, {
        averageRating: parseFloat(newAverage.toFixed(1)),
        ratingCount: newCount,
      });
    }
    return this._productRatingRepo._softDelete(rating, options);
  }

  async delete(
    rating: ProductRatingEntity,
    options?: IDeleteOptions<ProductRatingEntity>,
  ): Promise<ProductRatingEntity> {
    // Update product aggregates on hard delete
    const product = await this._productService.getById(rating.productId);
    if (product) {
      const oldCount = product.ratingCount || 0;
      const oldAverage = product.averageRating || 0;
      const newCount = Math.max(0, oldCount - 1);
      const newAverage =
        newCount === 0
          ? 0
          : (oldAverage * oldCount - rating.rating) / newCount;
      await this._productService.update(product.id, {
        averageRating: parseFloat(newAverage.toFixed(1)),
        ratingCount: newCount,
      });
    }
    return this._productRatingRepo._delete(rating, options);
  }

  async restore(
    options: IUpdateRawOptions<ProductRatingEntity>,
  ): Promise<UpdateResult | null> {
    const res = await this._productRatingRepo._restoreRaw(options);
    const id = (options as any)?.where?.id;
    if (id) {
      const restored = await this.getById(id, {
        options: { withDeleted: false },
      });
      if (restored) {
        const product = await this._productService.getById(restored.productId);
        if (product) {
          const oldCount = product.ratingCount || 0;
          const oldAverage = product.averageRating || 0;
          const newCount = oldCount + 1;
          const newAverage = (oldAverage * oldCount + restored.rating) / newCount;
          await this._productService.update(product.id, {
            averageRating: parseFloat(newAverage.toFixed(1)),
            ratingCount: newCount,
          });
        }
      }
    }
    return res;
  }

  async update(
    id: number,
    updateData: IProductRatingUpdateDto,
    options?: IUpdateOptions<ProductRatingEntity>,
  ): Promise<ProductRatingEntity> {
    const existingRating = await this.getById(id, options);
    if (!existingRating) {
      throw new NotFoundException(`Product rating with ID ${id} not found`);
    }
    const isRatingChanged =
      typeof updateData.rating === 'number' &&
      updateData.rating !== existingRating.rating;

    if (isRatingChanged) {
      const product = await this._productService.getById(
        existingRating.productId,
      );
      if (product) {
        const oldCount = product.ratingCount || 0;
        const oldAverage = product.averageRating || 0;
        if (oldCount > 0) {
          const adjustedTotal = oldAverage * oldCount - existingRating.rating;
          const newAverage = (adjustedTotal + (updateData.rating as number)) / oldCount;
          await this._productService.update(product.id, {
            averageRating: parseFloat(newAverage.toFixed(1)),
          });
        }
      }
    }

    Object.assign(existingRating, updateData);
    return this._productRatingRepo._update(existingRating, options);
  }

  // async getByProductAndUser(
  //   productId: number,
  //   userId: number,
  //   options?: IFindOneOptions<ProductRatingEntity>,
  // ): Promise<ProductRatingEntity | null> {
  //   return this._productRatingRepo._findOne({
  //     options: {
  //       where: { productId, userId },
  //       relations: options?.relations,
  //     },
  //   });
  // }

  // async getByProductId(
  //   productId: number,
  //   options?: IFindAllOptions<ProductRatingEntity>,
  // ): Promise<ProductRatingEntity[]> {
  //   return this._productRatingRepo._findAll({
  //     options: {
  //       where: { productId },
  //       relations: options?.relations,
  //       order: options?.order,
  //     },
  //   });
  // }

  async getAverageRating(productId: number): Promise<number> {
    const result = await this._productRatingRepo.getRepo()
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .where('rating.productId = :productId', { productId })
      .getRawOne();

    return parseFloat(result?.average || '0');
  }

  // async getRatingStats(productId: number): Promise<{
  //   average: number;
  //   total: number;
  //   distribution: Record<number, number>;
  // }> {
  //   const ratings = await this.getByProductId(productId);
  //   const total = ratings.length;
  //   const average = total > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  //   const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  //   ratings.forEach(rating => {
  //     distribution[rating.rating] = (distribution[rating.rating] || 0) + 1;
  //   });

  //   return { average: Number(average.toFixed(2)), total, distribution };
  // }

  // async validateProduct(productId: number) {
  //   return this._productService.fetchProduct(productId);
  // }
}
