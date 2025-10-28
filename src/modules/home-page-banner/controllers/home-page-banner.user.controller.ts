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
import { HomePageBannerCreateDto } from '../dto/home-page-banner.create.dto';
import { HomePageBannerUpdateDto } from '../dto/home-page-banner.update.dto';
import { HomePageBannerEntity } from '../entities/home-page-banner.entity';
import { HomePageBannerService } from '../services/home-page-banner.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';

@ApiTags('Home Page Banner')
@Controller('home-page-banners')
@ApiBearerAuth('accessToken')
export class HomePageBannerUserController {
  constructor(private readonly homePageBannerService: HomePageBannerService) {}

  @Get('/list')
  @ApiDocs({ operation: 'List Home Page Banners' })
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<HomePageBannerEntity>> {
    return this.homePageBannerService.paginatedGet({
      ...paginateQueryDto,
      searchableColumns: ['title', 'description'],
      defaultSearchColumns: ['title'],
      defaultSortColumn: 'orderIndex',
      sortableColumns: ['createdAt', 'id', 'orderIndex'],
      options: {
        where: {},
        relations: ['image'],
        order: { orderIndex: 'ASC' },
      },
    });
  }

   
  @Get(':id')
  @ApiDocs({ operation: 'Get Home Page Banner' })
  @RequestParamGuard(IdParamDto)
  async getById(
    @Param('id') id: number,
  ): Promise<IResponse<{ banner: object; message: string }>> {
    const banner = await this.homePageBannerService.getById(id, {
      options: { relations: ['image'] },
    });
    if (!banner) throw new NotFoundException('Cannot find Home Page Banner');
    return {
      data: {
        banner,
        message: 'Home page banner retrieved successfully.',
      },
    };
  }

  
}
