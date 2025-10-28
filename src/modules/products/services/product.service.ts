import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { ProductRepository } from '../repositories/product.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductCreateDto } from '../dto/product.create.dto';
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
import { ProductVariantCreateDto } from 'src/modules/product-variants/dto/product-variant.create.dto';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { ImageService } from 'src/modules/image/services/image.service';
import { plainToInstance } from 'class-transformer';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import slugify from 'slugify';
import { Option } from 'nestjs-command';
import { CategoryService } from 'src/modules/category/services/category.service';
import { ProductUpdateDto } from '../dto/product.update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorEntity } from 'src/modules/color/entities/color.entity';
import { promises } from 'dns';
import { ProductCacheService } from './product-cache.service';

@Injectable()
export class ProductService {
  private _dataSource: any;
  constructor(
    @InjectRepository(ProductEntity)
    private _productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private _categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ColorEntity)
    private _colorRepository: Repository<ColorEntity>,
    private _connection: DataSource,
    private readonly _productRepo: ProductRepository,
    private readonly _variantService: ProductVariantService,
    private readonly _imageService: ImageService,
    private readonly _categoryService: CategoryService,
    private readonly _productCache: ProductCacheService,
  ) {}
  async create(
    createDto: ProductCreateDto,
    options?: ICreateOptions,
  ): Promise<ProductEntity> {
    const {
      variants,
      images: imageIds,
      mainImageId,
      ...productData
    } = createDto;

    // Validate and fetch main image
    if (mainImageId) {
      const mainImage = await this._imageService.getById(mainImageId);
      if (!mainImage) {
        throw new BadRequestException(
          `Main image with ID ${mainImageId} not found`,
        );
      }
    }

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

    const product = await this._productRepo.createProduct({
      ...productData,
      images: imageIds,
      mainImageId,
    });

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

    // prime caches and invalidate list caches
    if (product?.id) {
      await this._productCache.setById(product.id, product);
    }
    if (product?.slug) {
      await this._productCache.setBySlug(product.slug, product);
    }
    await this._productCache.invalidateAllPaginated();

    return product;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ProductEntity>,
  ): Promise<ProductEntity | null> {
    // Try cache first
    const cached = await this._productCache.getById(id);
    if (cached) return cached;

    const product = await this._productRepo._findOneById(id, options);
    if (product) {
      await this._productCache.setById(id, product);
      if (product.slug)
        await this._productCache.setBySlug(product.slug, product);
    }
    return product;
  }

  async fetchProduct(id: number): Promise<ProductEntity | null> {
    return this._productRepo._findOneById(id, {
      options: {
        select: {
          variants: { id: true, color: true },
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
    // Try cache first
    const cached = await this._productCache.getPaginated(options);
    if (cached) return cached;

    const result = await this._productRepo._paginateFind(options);
    await this._productCache.setPaginated(options, result);
    return result;
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
    const deleted = await this._productRepo._softDelete(product, options);
    await this._productCache.invalidateForProduct({ id: product.id, slug: product.slug });
    await this._productCache.invalidateAllPaginated();
    return deleted;
  }
  async toggleFeatured(productId: number): Promise<ProductEntity> {
    const product = await this._productRepo._findOneById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    product.featured = !product.featured;
    const updated = await this._productRepo._update(product);
    await this._productCache.invalidateForProduct({ id: updated.id, slug: updated.slug });
    await this._productCache.setById(updated.id, updated);
    if (updated.slug) await this._productCache.setBySlug(updated.slug, updated);
    await this._productCache.invalidateAllPaginated();
    return updated;
  }

  async delete(
    product: ProductEntity,
    options?: IDeleteOptions<ProductEntity>,
  ): Promise<ProductEntity> {
    const removed = await this._productRepo._delete(product, options);
    await this._productCache.invalidateForProduct({ id: product.id, slug: product.slug });
    await this._productCache.invalidateAllPaginated();
    return removed;
  }

  async restore(
    options: IUpdateRawOptions<ProductEntity>,
  ): Promise<UpdateResult | null> {
    const res = await this._productRepo._restoreRaw(options);
    if (options?.where && typeof options.where === 'object' && 'id' in (options as any).where) {
      await this._productCache.invalidateById((options.where as any).id);
    }
    await this._productCache.invalidateAllPaginated();
    return res;
  }

  async update(
    id: number,
    updateData: ProductUpdateDto,
  ): Promise<ProductEntity> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this._productRepo._findOneById(id, {
        entityManager: queryRunner.manager,
        options: { relations: ['images', 'variants', 'category'] },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (updateData.categoryId) {
        const category = await this._categoryService.getById(
          updateData.categoryId,
          {
            options: { relations: ['children', 'parent'] },
            entityManager: queryRunner.manager,
          },
        );

        if (!category) {
          throw new NotFoundException('Category not found');
        }

        product.category = category;
      }

      if (updateData.images?.length) {
        const images: ImageEntity[] = [];

        for (const imageId of updateData.images) {
          const image = await this._imageService.getById(imageId, {
            entityManager: queryRunner.manager,
          });

          if (!image) {
            throw new BadRequestException(`Image with ID ${imageId} not found`);
          }

          images.push(image);
        }

        product.images = images;
      }

      if (updateData.mainImageId) {
        const mainImage = await this._imageService.getById(
          updateData.mainImageId,
          {
            entityManager: queryRunner.manager,
          },
        );

        if (!mainImage) {
          throw new BadRequestException(
            `Main image with ID ${updateData.mainImageId} not found`,
          );
        }

        product.mainImageId = updateData.mainImageId;
        product.mainImage = mainImage;
      }

      if (updateData.variants?.length) {
        await this._variantService.deleteById(product.id, {
          entityManager: queryRunner.manager,
        });

        const variantDtos = plainToInstance(
          ProductVariantCreateDto,
          updateData.variants.map((v) => ({ ...v, productId: product.id })),
        );

        for (const dto of variantDtos) {
          await this._variantService.create(dto, {
            entityManager: queryRunner.manager,
          });
        }
      }

      Object.assign(product, this.filterUpdateData(updateData));

      const updatedProduct = await this._productRepo._update(product, {
        entityManager: queryRunner.manager,
      });

      await queryRunner.commitTransaction();

      // Invalidate and refresh caches
      await this._productCache.invalidateForProduct({
        id: updatedProduct.id,
        slug: updatedProduct.slug,
      });
      await this._productCache.setById(updatedProduct.id, updatedProduct);
      if (updatedProduct.slug)
        await this._productCache.setBySlug(updatedProduct.slug, updatedProduct);
      await this._productCache.invalidateAllPaginated();
      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private filterUpdateData(
    updateData: ProductUpdateDto,
  ): Partial<ProductEntity> {
    const { variants, images, mainImageId, ...productData } = updateData;
    return productData;
  }

  // async update(
  //   product: ProductEntity,
  //   updateData: IProductUpdateDto,
  //   options?: IUpdateOptions<ProductEntity>,
  // ): Promise<ProductEntity> {
  //   const { variants, images: imageIds, ...productData } = updateData;

  //   // Validate and fetch images if provided
  //   if (imageIds?.length) {
  //     const images: ImageEntity[] = [];
  //     for (const id of imageIds) {
  //       const image = await this._imageService.getById(id, options);
  //       if (!image) {
  //         throw new BadRequestException(`Image with ID ${id} not found`);
  //       }
  //       images.push(image);
  //     }
  //     product.images = images;
  //   }

  //   // Update product data
  //   Object.assign(product, productData);

  //   // Save updated product
  //   const updatedProduct = await this._productRepo._update(product, options);

  //   // Handle variants if provided
  //   if (variants?.length) {
  //     // Optionally, delete existing variants (depending on requirements)
  //     // await this._variantService.deleteByProductId(product.id, options);

  //     // Create new variants
  //     const variantDtos = plainToInstance(
  //       ProductVariantCreateDto,
  //       variants.map((v) => ({ ...v, productId: product.id })),
  //     );

  //     for (const dto of variantDtos) {
  //       await this._variantService.create(dto, options);
  //     }
  //   }

  //   return updatedProduct;
  // }

  // ProductService.ts
  async getBySlug(slug: string): Promise<ProductEntity> {
    if (!slug) {
      throw new NotFoundException(`Slug is required`);
    }
    // Try cache first
    const cached = await this._productCache.getBySlug(slug);
    if (cached) return cached;

    const product = await this._productRepo._findOne({
      options: {
        where: { slug: slug },

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

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }
    await this._productCache.setBySlug(slug, product);
    if (product.id) await this._productCache.setById(product.id, product);
    return product;
  }

  async getFilterData() {
    const raw = await this._productRepository
      .createQueryBuilder('product')
      .select('MIN(product.price)', 'minPrice')
      .addSelect('MAX(product.price)', 'maxPrice')
      .getRawOne();

    const minPrice = parseFloat(raw.minPrice);
    const maxPrice = parseFloat(raw.maxPrice);

    const category = await this._categoryRepository.find();
    const color = await this._colorRepository.find();

    const data = {
      minPrice,
      maxPrice,
      category,
      color,
    };
    return data;
  }
}
