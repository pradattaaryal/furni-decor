import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductCreateDto } from '../dto/create-product.dto';
import { ProductUpdateDto } from '../dto/update-product.dto';
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
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { CategoryService } from 'src/modules/category/services/category.service';
import { SYSTEM_USER_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { Between } from 'typeorm';

@ApiTags('Products')
@Controller('/products')
export class PublicUserProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
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
    return await this.productService.paginatedGet({
      ...paginateQueryDto,
      options: {
        relations: {
          category: { parent: true, children: true },
          variants: { image: true },
          images: true,
        },
        where,
      },
      searchableColumns: ['name', 'description'],
      sortableColumns: ['id', 'name', 'createdAt', 'price'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
    });
  }

  @Get('/:id')
  @ApiDocs({ operation: 'Get Product by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this.productService.fetchProduct(params.id);

    return {
      data: {
        product,
        message: product
          ? 'Product retrieved successfully'
          : 'Product not found',
      },
    };
  }
}
