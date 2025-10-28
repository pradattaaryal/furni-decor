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
export class BlogCategoryMarketingController {
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

  @Post('/create')
  @ApiDocs({ operation: 'Create Blog Category' })
  async create(
    @Body() body: BlogCategoryCreateDto,
  ): Promise<IResponse<{ blogCategory: BlogCategoryEntity; message: string }>> {
    const blogCategory = await this.blogCategoryService.create(body);
    return {
      data: {
        blogCategory,
        message: 'Blog Category created successfully.',
      },
    };
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Blog Category' })
  @RequestParamGuard(IdParamDto)
  async getById(
    @Param('id') id: number,
  ): Promise<IResponse<{ blogCategory: object; message: string }>> {
    const blogCategory = await this.blogCategoryService.getById(id, {
      options: { relations: ['blogs'] },
    });
    if (!blogCategory) throw new NotFoundException('Cannot find Blog Category');
    return {
      data: {
        blogCategory,
        message: 'Blog Category retrieved successfully.',
      },
    };
  }

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update Blog Category' })
  @RequestParamGuard(IdParamDto)
  async updateById(
    @Param('id') id: number,
    @Body() updateBlogCategoryData: BlogCategoryUpdateDto,
  ): Promise<IResponse<{ blogCategory: BlogCategoryEntity; message: string }>> {
    const found = await this.blogCategoryService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Blog Category');
    const updated = await this.blogCategoryService.update(
      found,
      updateBlogCategoryData,
    );
    return {
      data: {
        blogCategory: updated,
        message: 'Blog Category updated successfully.',
      },
    };
  }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft delete Blog Category' })
  async softDeleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ blogCategory: BlogCategoryEntity; message: string }>> {
    const found = await this.blogCategoryService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Blog Category');

    const blogCategory = await this.blogCategoryService.softDelete(found);
    return {
      data: {
        blogCategory,
        message: 'Blog Category soft deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore Blog Category' })
  async restoreById(
    @Param('id') id: number,
  ): Promise<IResponse<{ blogCategory: BlogCategoryEntity; message: string }>> {
    await this.blogCategoryService.restore({ where: { id } });
    const blogCategory = await this.blogCategoryService.getById(id);
    if (!blogCategory) throw new NotFoundException('Cannot find Blog Category');
    return {
      data: {
        blogCategory,
        message: 'Blog Category restored successfully.',
      },
    };
  }

  @Delete('/hard-delete/:id')
  @ApiDocs({ operation: 'Hard delete Blog Category' })
  async deleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ blogCategory: BlogCategoryEntity; message: string }>> {
    const found = await this.blogCategoryService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Blog Category');

    const blogCategory = await this.blogCategoryService.delete(found);
    return {
      data: {
        blogCategory,
        message: 'Blog Category permanently deleted successfully.',
      },
    };
  }
}
