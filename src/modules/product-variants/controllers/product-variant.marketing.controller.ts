// controllers/product.admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  NotFoundException,
  Param,
  Patch,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';

import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { ProductVariantUpdateDto } from '../dto/product-variant.update.dto';
import { ProductVariantCreateDto } from '../dto/product-variant.create.dto';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductVariantService } from '../services/product-variant.service';

@ApiTags('Product Varients')
@Controller('ProductVarients')
@ApiBearerAuth('accessToken')
export class ProductVarientsMarketingController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Get('/list')
  @ApiDocs({ operation: 'List Product Variants' })
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<ProductVariantEntity>> {
    return this.productVariantService.paginatedGet({
      ...paginateQueryDto,
      defaultSortColumn: 'id',
      sortableColumns: ['createdAt', 'id'],
      options: {
        where: {},
        relations: { product: true, image: true, color: true },
      },
    });
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Product Variant' })
  @RequestParamGuard(IdParamDto)
  async getById(
    @Param('id') id: number,
  ): Promise<IResponse<{ product: ProductVariantEntity; message: string }>> {
    const found = await this.productVariantService.getById(id, {
      options: { relations: { product: true, image: true, color: true } },
    });
    if (!found) throw new NotFoundException('Cannot find Product variant');
    return {
      data: {
        product: found,
        message: 'Product variant retrieved successfully.',
      },
    };
  }

  @Post('/create')
  @ApiDocs({ operation: 'Create Product Variant' })
  async create(
    @Body() body: ProductVariantCreateDto,
  ): Promise<IResponse<{ product: ProductVariantEntity; message: string }>> {
    const product = await this.productVariantService.create(body);
    return {
      data: {
        product,
        message: 'Product variant created successfully.',
      },
    };
  }

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update ProductVarients' })
  @RequestParamGuard(IdParamDto)
  async updateById(
    @Param('id') id: number,
    @Body() updateProductVarientsData: ProductVariantUpdateDto,
  ): Promise<IResponse<{ product: ProductVariantEntity; message: string }>> {
    try {
      const found = await this.productVariantService.getById(id);
      if (!found) throw new NotFoundException('Cannot find Product variant');

      const updated = await this.productVariantService.update(
        found,
        updateProductVarientsData,
      );
      return {
        data: {
          product: updated,
          message: 'Product variant updated successfully.',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft delete Product Variant' })
  async softDeleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ product: ProductVariantEntity; message: string }>> {
    const found = await this.productVariantService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Product variant');

    const product = await this.productVariantService.softDelete(found);
    return {
      data: {
        product,
        message: 'Product variant soft deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore Product Variant' })
  async restoreById(
    @Param('id') id: number,
  ): Promise<IResponse<{ product: ProductVariantEntity; message: string }>> {
    await this.productVariantService.restore({ where: { id } });
    const product = await this.productVariantService.getById(id);
    if (!product) throw new NotFoundException('Cannot find Product variant');
    return {
      data: {
        product,
        message: 'Product variant restored successfully.',
      },
    };
  }

  @Delete('/hard-delete/:id')
  @ApiDocs({ operation: 'Hard delete Product Variant' })
  async deleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ product: ProductVariantEntity; message: string }>> {
    const found = await this.productVariantService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Product variant');

    const product = await this.productVariantService.delete(found);
    return {
      data: {
        product,
        message: 'Product variant permanently deleted successfully.',
      },
    };
  }
}
