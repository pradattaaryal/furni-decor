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
export class ProductVarientsUserController {
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

  
}
