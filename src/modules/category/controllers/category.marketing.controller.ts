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
export class CategoryMarketingController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Category' })
  async create(
    @Body() body: CategoryCreateDto,
  ): Promise<IResponse<{ category: CategoryEntity; message: string }>> {
    // Validate parent_id only if it is present (not undefined or null)
    if (body.parent_id !== undefined && body.parent_id !== null) {
      const parentCategory = await this.categoryService.getById(body.parent_id);
      if (!parentCategory) {
        throw new BadRequestException(
          `${body.parent_id} is not a valid Category Id!`,
        );
      }
    }

    const category = await this.categoryService.create(body);
    return {
      data: {
        category,
        message: 'Category created successfully.',
      },
    };
  }

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

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update Category' })
  @RequestParamGuard(IdParamDto)
  async updateById(
    @Param('id') id: number,
    @Body() updateCategoryData: CategoryUpdateDto,
  ): Promise<IResponse<{ category: CategoryEntity; message: string }>> {
    const found = await this.categoryService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Category');

    const updated = await this.categoryService.update(
      found,
      updateCategoryData,
    );
    return {
      data: {
        category: updated,
        message: 'Category updated successfully.',
      },
    };
  }

  // @Delete('/soft-delete/:id')
  // @ApiDocs({ operation: 'Soft delete Category' })
  // async softDeleteById(
  //   @Param('id') id: number,
  // ): Promise<IResponse<{ category: CategoryEntity; message: string }>> {
  //   const found = await this.categoryService.getById(id);
  //   if (!found) throw new NotFoundException('Cannot find Category');

  //   const category = await this.categoryService.softDelete(found);
  //   return {
  //     data: {
  //       category,
  //       message: 'Category soft deleted successfully.',
  //     },
  //   };
  // }

  // @Patch('/restore/:id')
  // @ApiDocs({ operation: 'Restore Category' })
  // async restoreById(
  //   @Param('id') id: number,
  // ): Promise<IResponse<{ category: CategoryEntity; message: string }>> {
  //   await this.categoryService.restore({ where: { id } });
  //   const category = await this.categoryService.getById(id);
  //   if (!category) throw new NotFoundException('Cannot find Category');
  //   return {
  //     data: {
  //       category,
  //       message: 'Category restored successfully.',
  //     },
  //   };
  // }

  // @Delete('/hard/:id')
  // @ApiDocs({ operation: 'Hard delete Category' })
  // async deleteById(
  //   @Param('id') id: number,
  // ): Promise<IResponse<{ category: CategoryEntity; message: string }>> {
  //   const found = await this.categoryService.getById(id);
  //   if (!found) throw new NotFoundException('Cannot find Category');

  //   const category = await this.categoryService.delete(found);
  //   return {
  //     data: {
  //       category,
  //       message: 'Category permanently deleted successfully.',
  //     },
  //   };
  // }
} //
