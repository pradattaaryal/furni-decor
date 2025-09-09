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
  SerializeOptions,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { CategoryCreateDto } from '../dto/create-category.dto';
import { CategoryUpdateDto } from '../dto/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';
import { CategoryPaginationSerialization, CategorySerialization } from '../serializations/category.serialization';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/authentication/guards/roles.guard';
import { Roles } from 'src/modules/authentication/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/constant/user-type.constant';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { DataSource } from 'typeorm';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('Category')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('accessToken')
export class CategoryAdminController {
  constructor(
    private readonly categoryService: CategoryService,
    private connection: DataSource,
  ) {}

  @ApiDocs({
    operation: 'Create Category.',
    serialization: CategorySerialization,
  })
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Category created successfully.')
  @Post('/create')
  async create(@Body() body: CategoryCreateDto): Promise<IResponse<CategoryEntity>> {
    try {
      const data: CategoryEntity = await this.categoryService.create(body);
      return { data };
    } catch (error) {
      throw error;
    }
  }

  @ApiDocs({
    operation: 'List Categories',
    serialization: CategoryPaginationSerialization,
  })
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Category list with pagination retrieved successfully.')
  @Get('/list')
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<CategoryEntity>> {
    const data = await this.categoryService.paginatedGet({
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
    return data;
  }

  @ApiDocs({
    operation: 'Get Category',
    serialization: CategorySerialization,
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @Roles(UserRole.ADMIN)
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Category retrieved successfully.')
  @Get(':id')
  async getById(@Param('id') id: number): Promise<IResponse<CategoryEntity>> {
    const data = await this.categoryService.getById(id, {
      options: {
        relations: ['children', 'parent'],
      },
    });
    if (!data) throw new NotFoundException('Cannot find Category');
    return { data };
  }

  @ApiDocs({
    operation: 'Update Category',
    serialization: CategorySerialization,
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @Roles(UserRole.ADMIN)
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Category updated successfully.')
  @Patch('/update/:id')
  async updateById(
    @Param('id') id: number,
    @Body() updateCategoryData: CategoryUpdateDto,
  ): Promise<IResponse<CategoryEntity>> {
    const found: CategoryEntity | null = await this.categoryService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Category');
    
    const updated = await this.categoryService.update(found, updateCategoryData);
    return { data: updated };
  }

  @ApiDocs({
    operation: 'Soft delete Category',
    serialization: CategorySerialization,
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Category soft deleted successfully.')
  @Delete('/soft-delete/:id')
  async softDeleteById(
    @Param('id') id: number,
  ): Promise<IResponse<CategoryEntity>> {
    const found: CategoryEntity | null = await this.categoryService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Category');
    
    const data = await this.categoryService.softDelete(found);
    return { data };
  }

  @ApiDocs({
    operation: 'Restore Category',
    serialization: CategorySerialization,
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Category restored successfully.')
  @Patch('/restore/:id')
  async restoreById(
    @Param('id') id: number,
  ): Promise<IResponse<CategoryEntity>> {
    await this.categoryService.restore({ where: { id } });
    const data: CategoryEntity | null = await this.categoryService.getById(id);
    if (!data) throw new NotFoundException('Cannot find Category');
    return { data };
  }

  @ApiDocs({
    operation: 'Delete Category',
    serialization: CategorySerialization,
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Category deleted successfully.')
  @Delete('/hard/:id')
  async deleteById(@Param('id') id: number): Promise<IResponse<CategoryEntity>> {
    const found: CategoryEntity | null = await this.categoryService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Category');
    
    const data = await this.categoryService.delete(found);
    return { data };
  }

  @ApiDocs({
    operation: 'Get Category by slug',
    serialization: CategorySerialization,
  })
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Category retrieved by slug successfully.')
  @Get('/slug/:slug')
  async getBySlug(@Param('slug') slug: string): Promise<IResponse<CategoryEntity[]>> {
    const data = await this.categoryService.fetchCategoryByName(slug);
    return { data };
  }
}
