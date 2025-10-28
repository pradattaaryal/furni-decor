// controllers/blog-category.admin.controller.ts
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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { BlogCategoryCreateDto } from '../dto/blog-category.create.dto';
import { BlogCategoryUpdateDto } from '../dto/blog-category.update.dto';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { BlogCategoryService } from '../services/blog-category.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';

@ApiTags('Blog Category')
@Controller('blog-categories')
@ApiBearerAuth('accessToken')
export class BlogCategoryUserController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Get('/list')
  @ApiDocs({ operation: 'List Blog Categories' })
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<BlogCategoryEntity>> {
    return this.blogCategoryService.paginatedGet({
      ...paginateQueryDto,
      searchableColumns: ['name'],
      defaultSearchColumns: ['name'],
      defaultSortColumn: 'id',
      sortableColumns: ['createdAt', 'id', 'name'],
      options: {
        where: {},
        relations: ['blogs'],
      },
    });
  }
 
}
