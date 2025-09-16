// controllers/category.admin.controller.ts
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
import { CategoryCreateDto } from '../dto/create-category.dto';
import { CategoryUpdateDto } from '../dto/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';

@ApiTags('Category')
@Controller('categories')
@ApiBearerAuth('accessToken')
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/list')
  @ApiDocs({ operation: 'List Categories' })
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<CategoryEntity>> {
    return this.categoryService.paginatedGet({
      ...paginateQueryDto,
      searchableColumns: ['name'],
      defaultSearchColumns: ['name'],
      defaultSortColumn: 'id',
      sortableColumns: ['createdAt', 'id', 'name'],
      options: {
        where: {},
        relations: ['children', 'parent'],
      },
    });
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Category' })
  @RequestParamGuard(IdParamDto)
  async getById(
    @Param('id') id: number,
  ): Promise<IResponse<{ category: object; message: string }>> {
    const category = await this.categoryService.getById(id, {
      options: { relations: ['children', 'parent'] },
    });
    if (!category) throw new NotFoundException('Cannot find Category');
    return {
      data: {
        category,
        message: 'Category retrieved successfully.',
      },
    };
  }
}
