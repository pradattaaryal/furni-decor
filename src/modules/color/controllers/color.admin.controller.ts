// controllers/color.admin.controller.ts
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
import { ColorCreateDto } from '../dto/color.create.dto';
import { ColorUpdateDto } from '../dto/color.update.dto';
import { ColorEntity } from '../entities/color.entity';
import { ColorService } from '../services/color.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';

@ApiTags('Color')
@Controller('colors')
@ApiBearerAuth('accessToken')
export class ColorAdminController {
  constructor(private readonly colorService: ColorService) {}

  @Get('/list')
  @ApiDocs({ operation: 'List Colors' })
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<ColorEntity>> {
    return this.colorService.paginatedGet({
      ...paginateQueryDto,
      searchableColumns: ['name', 'hexCode'],
      defaultSearchColumns: ['name'],
      defaultSortColumn: 'id',
      sortableColumns: ['createdAt', 'id', 'name'],
      options: {
        where: {},
      },
    });
  }

  @Post('/create')
  @ApiDocs({ operation: 'Create Color' })
  async create(
    @Body() body: ColorCreateDto,
  ): Promise<IResponse<{ color: ColorEntity; message: string }>> {
    const color = await this.colorService.create(body);
    return {
      data: {
        color,
        message: 'Color created successfully.',
      },
    };
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Color' })
  @RequestParamGuard(IdParamDto)
  async getById(
    @Param('id') id: number,
  ): Promise<IResponse<{ color: object; message: string }>> {
    const color = await this.colorService.getById(id);
    if (!color) throw new NotFoundException('Cannot find Color');
    return {
      data: {
        color,
        message: 'Color retrieved successfully.',
      },
    };
  }

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update Color' })
  @RequestParamGuard(IdParamDto)
  async updateById(
    @Param('id') id: number,
    @Body() updateColorData: ColorUpdateDto,
  ): Promise<IResponse<{ color: ColorEntity; message: string }>> {
    const found = await this.colorService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Color');
    const updated = await this.colorService.update(found, updateColorData);
    return {
      data: {
        color: updated,
        message: 'Color updated successfully.',
      },
    };
  }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft delete Color' })
  async softDeleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ color: ColorEntity; message: string }>> {
    const found = await this.colorService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Color');

    const color = await this.colorService.softDelete(found);
    return {
      data: {
        color,
        message: 'Color soft deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore Color' })
  async restoreById(
    @Param('id') id: number,
  ): Promise<IResponse<{ color: ColorEntity; message: string }>> {
    await this.colorService.restore({ where: { id } });
    const color = await this.colorService.getById(id);
    if (!color) throw new NotFoundException('Cannot find Color');
    return {
      data: {
        color,
        message: 'Color restored successfully.',
      },
    };
  }

  @Delete('/hard-delete/:id')
  @ApiDocs({ operation: 'Hard delete Color' })
  async deleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ color: ColorEntity; message: string }>> {
    const found = await this.colorService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Color');

    const color = await this.colorService.delete(found);
    return {
      data: {
        color,
        message: 'Color permanently deleted successfully.',
      },
    };
  }
}
