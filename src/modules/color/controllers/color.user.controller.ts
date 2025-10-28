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
export class ColorUserController {
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

  
 
}
