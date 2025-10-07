// controllers/blog.admin.controller.ts
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
import { BlogEntity } from '../entities/blog.entity';
import { UpdateBlogDto } from '../dto/blog.update.dto';
import { CreateBlogDto } from '../dto/blog.create.dto';
import { BlogService } from '../services/blog.service';
import { object } from 'joi';

@ApiTags('Blog')
@Controller('blog')
@ApiBearerAuth('accessToken')
export class BlogAdminController {
  constructor(private readonly _blogService: BlogService) {}
  @Get('/list')
  @ApiDocs({ operation: 'List Blog' })
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<BlogEntity>> {
    return this._blogService.paginatedGet({
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
  @Post('/create')
  @ApiDocs({ operation: 'Create Blog' })
  async create(
    @Body() body: CreateBlogDto,
  ): Promise<IResponse<{ blog: { }; message: string }>> {
    const blog = {};
    if (!blog) throw new BadRequestException('Cannot create Blog');
    return {
      data: {
        blog,
        message: 'Blog created successfully.',
      },
    };
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Blog' })
  @RequestParamGuard(IdParamDto)
  async getById(
    @Param('id') id: number,
  ): Promise<IResponse<{ blog: object; message: string }>> {
    const blog = await this._blogService.getById(id, {
      options: { relations: ['children', 'parent'] },
    });
    if (!blog) throw new NotFoundException('Cannot find Blog');
    return {
      data: {
        blog,
        message: 'Blog retrieved successfully.',
      },
    };
  }

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update Blog' })
  @RequestParamGuard(IdParamDto)
  async updateById(
    @Param('id') id: number,
    @Body() updateBlogData: UpdateBlogDto,
  ): Promise<IResponse<{ blog: BlogEntity; message: string }>> {
    const found = await this._blogService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Blog');
    const updated = await this._blogService.update(
      found,
      updateBlogData,
    );
    return {
      data: {
        blog: updated,
        message: 'Blog updated successfully.',
      },
    };
  }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft delete Blog' })
  async softDeleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ blog: BlogEntity; message: string }>> {
    const found = await this._blogService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Blog');

    const blog = await this._blogService.softDelete(found);
    return {
      data: {
        blog,
        message: 'Blog soft deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore Blog' })
  async restoreById(
    @Param('id') id: number,
  ): Promise<IResponse<{ blog: BlogEntity; message: string }>> {
    await this._blogService.restore({ where: { id } });
    const blog = await this._blogService.getById(id);
    if (!blog) throw new NotFoundException('Cannot find Blog');
    return {
      data: {
        blog,
        message: 'Blog restored successfully.',
      },
    };
  }

  @Delete('/hard-delete/:id')
  @ApiDocs({ operation: 'Hard delete Blog' })
  async deleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ blog: BlogEntity; message: string }>> {
    const found = await this._blogService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Blog');

    const blog = await this._blogService.delete(found);
    return {
      data: {
        blog,
        message: 'Blog permanently deleted successfully.',
      },
    };
  }
}
