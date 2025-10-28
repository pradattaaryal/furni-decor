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
export class HomePageBannerAdminController {
  constructor(
    private readonly homePageBannerService: HomePageBannerService,
  ) {}

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

  @Post('/create')
  @ApiDocs({ operation: 'Create Home Page Banner' })
  async create(
    @Body() body: HomePageBannerCreateDto,
  ): Promise<IResponse<{ banner: HomePageBannerEntity; message: string }>> {
    const banner = await this.homePageBannerService.create(body);
    const createdBanner = await this.homePageBannerService.getById(banner.id, {
      options: { relations: ['image'] },
    });
    if (!createdBanner) throw new NotFoundException('Cannot find Home Page Banner');
    return {
      data: {
        banner: createdBanner,
        message: 'Home page banner created successfully.',
      },
    };
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

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update Home Page Banner' })
  @RequestParamGuard(IdParamDto)
  async updateById(
    @Param('id') id: number,
    @Body() updateBannerData: HomePageBannerUpdateDto,
  ): Promise<
    IResponse<{ banner: HomePageBannerEntity; message: string }>
  > {
    const found = await this.homePageBannerService.getById(id);
    if (!found)
      throw new NotFoundException('Cannot find Home Page Banner');
    await this.homePageBannerService.update(found, updateBannerData);
    const banner = await this.homePageBannerService.getById(id, {
      options: { relations: ['image'] },
    });
    if (!banner) throw new NotFoundException('Cannot find Home Page Banner');
    return {
      data: {
        banner,
        message: 'Home page banner updated successfully.',
      },
    };
  }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft delete Home Page Banner' })
  async softDeleteById(
    @Param('id') id: number,
  ): Promise<
    IResponse<{ banner: HomePageBannerEntity; message: string }>
  > {
    const found = await this.homePageBannerService.getById(id);
    if (!found)
      throw new NotFoundException('Cannot find Home Page Banner');

    const banner = await this.homePageBannerService.softDelete(found);
    return {
      data: {
        banner,
        message: 'Home page banner soft deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore Home Page Banner' })
  async restoreById(
    @Param('id') id: number,
  ): Promise<
    IResponse<{ banner: HomePageBannerEntity; message: string }>
  > {
    await this.homePageBannerService.restore({ where: { id } });
    const banner = await this.homePageBannerService.getById(id, {
      options: { relations: ['image'] },
    });
    if (!banner)
      throw new NotFoundException('Cannot find Home Page Banner');
    return {
      data: {
        banner,
        message: 'Home page banner restored successfully.',
      },
    };
  }

  @Delete('/hard-delete/:id')
  @ApiDocs({ operation: 'Hard delete Home Page Banner' })
  async deleteById(
    @Param('id') id: number,
  ): Promise<
    IResponse<{ banner: HomePageBannerEntity; message: string }>
  > {
    const found = await this.homePageBannerService.getById(id);
    if (!found)
      throw new NotFoundException('Cannot find Home Page Banner');

    const banner = await this.homePageBannerService.delete(found);
    return {
      data: {
        banner,
        message: 'Home page banner permanently deleted successfully.',
      },
    };
  }
}
