import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductEntity } from '../entities/product.entity';
import { ProductPaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { Between } from 'typeorm';
import { ApiDocs } from 'src/common/doc/common-docs';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
 
@ApiTags('Products')
@Controller('products')
export class PublicUserProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Get('list')
  @ApiDocs({ operation: 'List Products' })
  @ResponseMessage('Products retrieved successfully')
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
      paginateQueryDto.searchBy = '@@nameTsv'
    }
    delete paginateQueryDto.minPrice;
    delete paginateQueryDto.maxPrice;
    delete paginateQueryDto.categoryId;
    delete paginateQueryDto.color;

    const data =  await this.productService.paginatedGet({
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
            images: true,
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
