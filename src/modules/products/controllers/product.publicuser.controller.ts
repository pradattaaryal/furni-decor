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
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { CategoryService } from 'src/modules/category/services/category.service';
 
@ApiTags('Products')
@Controller('products')
export class PublicUserProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('list')
  @ApiDocs({ operation: 'List Products' })
  @ResponseMessage('Products retrieved successfully')
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<ProductEntity>> {

    if (paginateQueryDto.searchBy == 'name') {
      paginateQueryDto.searchBy = '@@nameTsv'
    }
    const data = await this.productService.paginatedGet({
      ...paginateQueryDto,
      relations: {
        category: {
          parent: true,
          children: true,
        },
      },
      searchableColumns: ['@@nameTsv'],
      defaultSearchColumns: ['@@nameTsv'],
      sortableColumns: ['id', 'name', 'createdAt'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
    });

    return data;
  }

  @Get(':id')
  @ApiDocs({
    operation: 'Get Product By Id'
  })
  @ResponseMessage('Product retrieved successfully')
  async getById(
    @Param() param: IdParamDto,
  ): Promise<IResponse<ProductEntity>> {
    const data = await this.productService.getById(
      param.id,
      {
        options: {
          relations: {
            category: {
              parent: true,
              children: true,
            },
            variants: true,
          }
        }
      }
    );
    if (!data) {
      throw new NotFoundException('Product Not Found')
    } else {
      return {
        data
      };
    }
    
  }
}
