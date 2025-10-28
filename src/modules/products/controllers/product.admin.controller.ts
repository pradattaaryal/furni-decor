import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductCreateDto } from '../dto/product.create.dto';
import { ProductUpdateDto } from '../dto/product.update.dto';
import { ProductEntity } from '../entities/product.entity';
import {
  PaginateQueryDto,
  ProductPaginateQueryDto,
} from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { CategoryService } from 'src/modules/category/services/category.service';
import {
  Between,
  DataSource,
  IsNull,
  MoreThanOrEqual,
  QueryRunner,
  Repository,
} from 'typeorm';
import { ProductResponseDto } from '../dto/product.response.dto';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { InjectRepository } from '@nestjs/typeorm';

@ApiTags('Products')
@Controller('/products')
export class ProductAdminController {
  constructor(

    private readonly _productService: ProductService,
    private readonly _categoryService: CategoryService,

    private _connection: DataSource,
  ) { }

  @Get('/list')
  @ApiDocs({ operation: 'List Products' })
  async list(
    @Query() paginateQueryDto: ProductPaginateQueryDto,
  ): Promise<IResponsePaging<any>> {
    const where: any = {};
    if (
      paginateQueryDto.minPrice !== undefined &&
      paginateQueryDto.maxPrice !== undefined
    ) {
      where.price = Between(
        paginateQueryDto.minPrice,
        paginateQueryDto.maxPrice,
      );
    }

    if (paginateQueryDto.rating !== undefined) {
      where.averageRating = MoreThanOrEqual(paginateQueryDto.rating);
    }

    if (paginateQueryDto.categoryId !== undefined) {
      where.category = { id: paginateQueryDto.categoryId };
    }
    if (paginateQueryDto.colorId !== undefined) {
      where.variants = {
        color: {
          id: paginateQueryDto.colorId,
        },
      };
    }

    if (paginateQueryDto.searchBy == 'name') {
      paginateQueryDto.searchBy = '@@nameTsv';
    }
    delete paginateQueryDto.minPrice;
    delete paginateQueryDto.maxPrice;
    delete paginateQueryDto.categoryId;

    const data = await this._productService.paginatedGet({
      ...paginateQueryDto,
      options: {
        relations: {
           category: { parent: true, children: true },
          variants: { image: true, color: true },
          images: true,
          mainImage: true,
        },

        where,
      },
      searchableColumns: ['@@nameTsv'],
      defaultSearchColumns: ['@@nameTsv'],
      sortableColumns: ['id', 'name', 'createdAt', 'price'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
    });

    return data;
  }

  @Post('/create')
  @ApiDocs({ operation: 'Create Product' })
  async create(
    @Body() body: ProductCreateDto,
  ): Promise<IResponse<{ product: ProductEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this._categoryService.getById(body.categoryId, {
        options: { relations: ['children', 'parent'] },
      });
      if (!category) throw new NotFoundException('Cannot find Category');

      const product = await this._productService.create(body, {
        entityManager: queryRunner.manager,
      });

      await queryRunner.commitTransaction();

      return {
        data: {
          product,
          message: 'Product created successfully',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Get('/slug/:slug')
  @ApiDocs({ operation: 'Get Product by Slug' })
  async getBySlug(
    @Param('slug') slug: string,
  ): Promise<
    IResponse<{ product: ProductResponseDto | null; message: string }>
  > {
    const product = await this._productService.getOne({
      options: {
        where: {
          slug,
          deletedAt: IsNull(),
        },
        relations: {
          category: { parent: true, children: true },
          variants: { image: true, color: true },
          images: true,
          mainImage: true,
        },
      },
    });

    let productDto: ProductResponseDto | null = null;
    if (product) {
      productDto = this.mapToResponseDto(product);
    }

    return {
      data: {
        product: productDto,
        message: product
          ? 'Product retrieved successfully'
          : 'Product not found',
      },
    };
  }

  @Patch('/toggle-featured/:id')
  @ApiDocs({ operation: 'Toggle Product Featured Status' })
  async toggleFeatured(
    @Param('id') id: number,
  ): Promise<
    IResponse<{ product: ProductResponseDto | null; message: string }>
  > {
    const product = await this._productService.toggleFeatured(id);

    let productDto: ProductResponseDto | null = null;
    if (product) {
      productDto = this.mapToResponseDto(product);
    }

    return {
      data: {
        product: productDto,
        message: `Product ${product.id} is now ${product.featured ? 'featured' : 'not featured'}`,
      },
    };
  }
  // @Get('/list-related-products/:id')
  // @ApiDocs({ operation: 'List Related Products' })
  // @RequestParamGuard(IdParamDto)
  // async listRelatedProduct(
  //   @Param('id') id: number,
  //   @Query() paginateQueryDto: PaginateQueryDto,
  // ): Promise<IResponsePaging<ProductEntity>> {
  //   const where: any = {};

  //   const data = await this._productService.paginatedGet({
  //     ...paginateQueryDto,
  //     options: {
  //       relations: {
  //         category: { parent: true, children: true },
  //         variants: { image: true, color: true },
  //         images: true,
  //         mainImage: true,
  //       },
  //       where,
  //     },
  //   });

  //   return data;
  // }

  @Get(':id')
  @ApiDocs({ operation: 'Get Product by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<
    IResponse<{ product: ProductResponseDto | null; message: string }>
  > {
    const product = await this._productService.getById(params.id, {
      relations: {
        category: { parent: true, children: true },
        variants: { image: true, color: true },
        images: true,
        mainImage: true,
      },
    });
    let productDto: ProductResponseDto | null = null;
    if (product) {
      productDto = this.mapToResponseDto(product);
    }
    return {
      data: {
        product: productDto,
        message: 'Product retrieved successfully',
      },
    };
  }


  @Get()
  @ApiDocs({ operation: 'Get filter data for product ' })
  async getFilterData(

  ): Promise<
    IResponse<{ data: object; message: string }>
  > {
    try {
      const data = await this._productService.getFilterData();

      return {
        data: {
          data,
          message: 'Product retrieved successfully',
        },
      };
    } catch (err) {
      throw err;
    }
  }





  @Patch(':id')
  @ApiDocs({ operation: 'Update Product' })
  async updateById(
    @Param() params: IdParamDto,
    @Body() updateProductData: ProductUpdateDto,
  ): Promise<IResponse<{ product: ProductResponseDto; message: string }>> {
    const updatedProduct = await this._productService.update(
      params.id,
      updateProductData,
    );
    return {
      data: {
        product: this.mapToResponseDto(updatedProduct),
        message: 'Product updated successfully',
      },
    };
  }

  @Delete('soft-delete/:id')
  @ApiDocs({ operation: 'Soft Delete Product' })
  async softDeleteById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this._productService.getById(params.id);
    if (!product) {
      return {
        data: {
          product: null,
          message: 'Product not found',
        },
      };
    }

    const softDeletedProduct = await this._productService.softDelete(product);
    return {
      data: {
        product: softDeletedProduct,
        message: 'Product soft deleted successfully',
      },
    };
  }

  @Patch('restore/:id')
  @ApiDocs({ operation: 'Restore Product' })
  async restoreById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const restoreResult = await this._productService.restore({
      where: { id: params.id },
    });
    if (!restoreResult || restoreResult.affected === 0) {
      return {
        data: {
          product: null,
          message: 'Product not found or already restored',
        },
      };
    }

    const restoredProduct = await this._productService.getById(params.id);
    return {
      data: {
        product: restoredProduct,
        message: 'Product restored successfully',
      },
    };
  }

  @Delete('hard-delete/:id')
  @ApiDocs({ operation: 'Delete Product' })
  async deleteById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this._productService.getById(params.id);
    if (!product) {
      return {
        data: {
          product: null,
          message: 'Product not found',
        },
      };
    }

    const deletedProduct = await this._productService.delete(product);
    return {
      data: {
        product: deletedProduct,
        message: 'Product deleted successfully',
      },
    };
  }

  private mapToResponseDto(product: ProductEntity): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      tag: product.tag,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      additionalData: {
        dimensions: product.dimensions,

        general: {
          salesPackage: product.salesPackage,
          model: product.modelNumber,
          secondaryMaterial: product.secondaryMaterial,
          configuration: product.configuration,
          upholsteryMaterial: product.upholsteryMaterial,
          upholsteryColor: product.upholsteryColor,
        },
        product: {
          fillingMaterial: product.fillingMaterial,
          finishType: product.finishType,
          adjustableHeadrest: product.adjustableHeadrest,
          maxLoad: product.maxLoad,
          originOfManufacture: product.originOfManufacture,
        },
        warranty: {
          warrantySummary: product.warrantySummary,
          warrantyServiceType: product.warrantyServiceType,
          coveredInWarranty: product.coveredInWarranty,
          notCoveredInWarranty: product.notCoveredInWarranty,
          domesticWarranty: product.domesticWarranty,
        },
      },

      variants: product.variants?.map((variant) => {
        const { image, ...rest } = variant;
        const mappedVariant: any = { ...rest, image };
        return mappedVariant;
      }),

      images: product.images?.map((img) => ({
        id: img.id,
        path: img.path,
        filename: img.filename,
        mime: img.mime,
      })),

      mainImage: product.mainImage
        ? {
          id: product.mainImage.id,
          path: product.mainImage.path,
          filename: product.mainImage.filename,
          mime: product.mainImage.mime,
        }
        : undefined,

      category: product.category,
    };
  }
}
