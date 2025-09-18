import { BadRequestException, Injectable } from '@nestjs/common';
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
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { ImageService } from 'src/modules/image/services/image.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    private readonly _productRepo: ProductRepository,
    private readonly _variantService: ProductVariantService,
    private readonly _imageService: ImageService,
  ) {}

  //   async create(
  //     createDto: ProductCreateDto,
  //     options?: ICreateOptions,
  //   ): Promise<ProductEntity> {
  //     const { variants, images: imageIds, ...productData } = createDto;
  //  let images: ImageEntity[] = [];
  //   if (imageIds && imageIds.length > 0) {
  //      for (const id of imageIds) {
  //       const image = await this._imageService.getById(id);
  //       if (!image) {
  //         throw new BadRequestException(`Image with ID ${id} not found`);
  //       }
  //       images.push(image);
  //     }
  //   }
  //    const product = await this._productRepo._create(
  //     { ...productData, images },
  //     options,
  //   );
  //     if (variants && variants.length > 0) {
  //       for (const variantData of variants) {
  //         const variantDto = new ProductVariantCreateDto();
  //         variantDto.dimensions = variantData.dimensions;
  //         variantDto.color = variantData.color;
  //         variantDto.productId = product.id;
  //         variantDto.count = variantData.count;
  //         variantDto.imageId = variantData.imageId;
  //         console.log(variantDto);
  //         await this._variantService.create(variantDto);
  //       }
  //     }

  //     return product;
  //   }

  async create(
    createDto: ProductCreateDto,
    options?: ICreateOptions,
  ): Promise<ProductEntity> {
    const { variants, images: imageIds, ...productData } = createDto;

    // Validate and fetch images
    const images: ImageEntity[] = [];
    if (imageIds?.length) {
      for (const id of imageIds) {
        const image = await this._imageService.getById(id);
        if (!image) {
          throw new BadRequestException(`Image with ID ${id} not found`);
        }
        images.push(image);
      }
    }

    // Create the product
    const product = await this._productRepo._create(
      { ...productData, images },
      options,
    );

    // Create variants if any
    if (variants?.length) {
      const variantDtos = plainToInstance(
        ProductVariantCreateDto,
        variants.map((v) => ({ ...v, productId: product.id })),
      );

      for (const dto of variantDtos) {
        await this._variantService.create(dto);
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
          variants: { id: true, color: true, dimensions: true },
        },
        relations: {
          category: {
            parent: true,
            children: true,
          },
          variants: {
            image: true,
          },
          images: true,
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
  ): Promise<ProductEntity> {
    const { variants, images: imageIds, ...productData } = updateData;

    // Validate and fetch images if provided
    if (imageIds?.length) {
      const images: ImageEntity[] = [];
      for (const id of imageIds) {
        const image = await this._imageService.getById(id, options);
        if (!image) {
          throw new BadRequestException(`Image with ID ${id} not found`);
        }
        images.push(image);
      }
      product.images = images;
    }

    // Update product data
    Object.assign(product, productData);

    // Save updated product
    const updatedProduct = await this._productRepo._update(product, options);

    // Handle variants if provided
    if (variants?.length) {
      // Optionally, delete existing variants (depending on requirements)
     // await this._variantService.deleteByProductId(product.id, options);

      // Create new variants
      const variantDtos = plainToInstance(
        ProductVariantCreateDto,
        variants.map((v) => ({ ...v, productId: product.id })),
      );

      for (const dto of variantDtos) {
        await this._variantService.create(dto, options);
      }
    }

    return updatedProduct;
  }
}
