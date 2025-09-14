import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IResponse, IResponsePaging } from 'src/common/response/interfaces/response.interface';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { ProductVariantService } from '../services/product-variant.service';
import { ProductVariantCreateDto } from '../dto/create-product-variant.dto';
import { ProductVariantUpdateDto } from '../dto/update-product-variant.dto';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductService } from 'src/modules/products/services/product.service';

@ApiTags('Product Variants')
@Controller({
  version: '1',
  path: '/product-variants',
})
export class ProductVariantAdminController {
  constructor(
    private readonly variantService: ProductVariantService,
    private readonly productService: ProductService,
  ) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Product Variant' })
  async create(@Body() body: ProductVariantCreateDto): Promise<IResponse<{ variant: ProductVariantEntity; message: string }>> {
    const product = await this.productService.getById(body.productId);
    if (!product) throw new NotFoundException('Cannot find Product');

    const variant = await this.variantService.create(body);
    return {
      data: {
        variant,
        message: 'Product variant created successfully',
      },
    };
  }

  @Get('/list')
  @ApiDocs({ operation: 'List Product Variants' })
  async list(@Query() paginateQueryDto: PaginateQueryDto): Promise<IResponsePaging<ProductVariantEntity>> {
    return this.variantService.paginatedGet({
      ...paginateQueryDto,
      searchableColumns: ['color'],
      sortableColumns: ['id', 'createdAt'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
      options: { relations: { product: true } as any },
    });
  }

  @Get('/:id')
  @ApiDocs({ operation: 'Get Product Variant by ID' })
  async getById(@Param() params: IdParamDto): Promise<IResponse<{ variant: ProductVariantEntity | null; message: string }>> {
    const variant = await this.variantService.getById(params.id);
    return {
      data: {
        variant,
        message: variant ? 'Product variant retrieved successfully' : 'Product variant not found',
      },
    };
  }

  @Patch('/:id')
  @ApiDocs({ operation: 'Update Product Variant' })
  async updateById(@Param() params: IdParamDto, @Body() updateDto: ProductVariantUpdateDto): Promise<IResponse<{ variant: ProductVariantEntity | null; message: string }>> {
    const variant = await this.variantService.getById(params.id);
    if (!variant) {
      return {
        data: {
          variant: null,
          message: 'Product variant not found',
        },
      };
    }

    const updated = await this.variantService.update(variant, updateDto);
    return {
      data: {
        variant: updated,
        message: 'Product variant updated successfully',
      },
    };
  }

  @Delete('/:id/soft-delete')
  @ApiDocs({ operation: 'Soft Delete Product Variant' })
  async softDeleteById(@Param() params: IdParamDto): Promise<IResponse<{ variant: ProductVariantEntity | null; message: string }>> {
    const variant = await this.variantService.getById(params.id);
    if (!variant) {
      return {
        data: {
          variant: null,
          message: 'Product variant not found',
        },
      };
    }

    const softDeleted = await this.variantService.softDelete(variant);
    return {
      data: {
        variant: softDeleted,
        message: 'Product variant soft deleted successfully',
      },
    };
  }

  @Patch('/:id/restore')
  @ApiDocs({ operation: 'Restore Product Variant' })
  async restoreById(@Param() params: IdParamDto): Promise<IResponse<{ variant: ProductVariantEntity | null; message: string }>> {
    const restoreResult = await this.variantService.restore({ where: { id: params.id } });
    if (!restoreResult || restoreResult.affected === 0) {
      return {
        data: {
          variant: null,
          message: 'Product variant not found or already restored',
        },
      };
    }

    const restored = await this.variantService.getById(params.id);
    return {
      data: {
        variant: restored,
        message: 'Product variant restored successfully',
      },
    };
  }

  @Delete('/:id')
  @ApiDocs({ operation: 'Delete Product Variant' })
  async deleteById(@Param() params: IdParamDto): Promise<IResponse<{ variant: ProductVariantEntity | null; message: string }>> {
    const variant = await this.variantService.getById(params.id);
    if (!variant) {
      return {
        data: {
          variant: null,
          message: 'Product variant not found',
        },
      };
    }

    const deleted = await this.variantService.delete(variant);
    return {
      data: {
        variant: deleted,
        message: 'Product variant deleted successfully',
      },
    };
  }
} 