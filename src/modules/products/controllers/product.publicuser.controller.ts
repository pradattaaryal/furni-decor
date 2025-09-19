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
import { Between, DataSource, QueryRunner } from 'typeorm';

@ApiTags('Products')
@Controller('/products')
export class PublicUserProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
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

    const data = await this.productService.paginatedGet({
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

  @Get(':id')
  @ApiDocs({ operation: 'Get Product by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this.productService.getById(params.id, {
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
}
