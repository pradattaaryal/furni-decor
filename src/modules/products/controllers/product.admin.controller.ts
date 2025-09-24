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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductCreateDto } from '../dto/product.create.dto';
import { ProductUpdateDto } from '../dto/product.update.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductPaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { CategoryService } from 'src/modules/category/services/category.service';
import { Between, DataSource, IsNull, QueryRunner } from 'typeorm';

@ApiTags('Products')
@Controller('/products')
export class ProductAdminController {
  constructor(
    private readonly _productService: ProductService,
    private readonly _categoryService: CategoryService,
    private _connection: DataSource,
  ) {}

  @Get('/list')
  @ApiDocs({ operation: 'List Products' })
  async list(
    @Query() paginateQueryDto: ProductPaginateQueryDto,
  ): Promise<IResponsePaging<ProductEntity>> {
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
    if (paginateQueryDto.categoryId !== undefined) {
      where.category = { id: paginateQueryDto.categoryId };
    }
    if (paginateQueryDto.color) {
      where.variants = { color: paginateQueryDto.color };
    }

    if (paginateQueryDto.searchBy == 'name') {
      paginateQueryDto.searchBy = '@@nameTsv';
    }
    delete paginateQueryDto.minPrice;
    delete paginateQueryDto.maxPrice;
    delete paginateQueryDto.categoryId;
    delete paginateQueryDto.color;

    const data = await this._productService.paginatedGet({
      ...paginateQueryDto,
      options: {
        relations: {
          category: { parent: true, children: true },
          variants: { image: true },
          images: true,
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
  async getBySLug(
    @Param('slug') slug: string,
  ): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this._productService.getOne({
      options: {
        where: {
          slug: slug,
          deletedAt: IsNull(),
        },
        relations: {
          category: { parent: true, children: true },
          variants: { image: true },
          images: true,
        },
      },
    });

    return {
      data: {
        product,
        message: product
          ? 'Product retrieved successfully'
          : 'Product not found',
      },
    };
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Product by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this._productService.getById(params.id, {
      relations: {
        category: { parent: true, children: true },
        variants: { image: true },
        images: true,
      },
    });

    return {
      data: {
        product,
        message: product
          ? 'Product retrieved successfully'
          : 'Product not found',
      },
    };
  }

  @Patch(':id')
  @ApiDocs({ operation: 'Update Product' })
  async updateById(
    @Param() params: IdParamDto,
    @Body() updateProductData: ProductUpdateDto,
  ): Promise<IResponse<{ product: ProductEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate product existence
      const existingProduct = await this._productService.getById(params.id, {
        entityManager: queryRunner.manager,
      });
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      // Validate category if provided in update
      if (updateProductData.categoryId) {
        const category = await this._categoryService.getById(
          updateProductData.categoryId,
          {
            options: { relations: ['children', 'parent'] },
            entityManager: queryRunner.manager,
          },
        );
        if (!category) {
          throw new NotFoundException('Cannot find Category');
        }
      }

      // Update product
      const updatedProduct = await this._productService.update(
        existingProduct,
        updateProductData,
        { entityManager: queryRunner.manager },
      );

      await queryRunner.commitTransaction();

      return {
        data: {
          product: updatedProduct,
          message: 'Product updated successfully',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
}
