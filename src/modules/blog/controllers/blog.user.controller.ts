import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { CreateBlogDto } from '../dto/blog.create.dto';
import { BlogEntity } from '../entities/blog.entity';
import { BlogService } from '../services/blog.service';
import { IsNull } from 'typeorm';

@ApiTags('Blog')
@Controller('/blogs')
export class BlogUserController {
  constructor(private readonly blogService: BlogService) {}
  @Get('/list-all')
  @ApiDocs({ operation: 'List All Blogs' })
  async listAll(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<BlogEntity>> {
    if (paginateQueryDto.searchBy == 'title') {
      paginateQueryDto.searchBy = '@@nameTsv';
    }
    const data = await this.blogService.paginatedGet({
      ...paginateQueryDto,
      options: {
        withDeleted: false,
        relations: { author: true, category: true, image: true },
      },
      searchableColumns: ['@@nameTsv'],
      sortableColumns: ['id', 'createdAt'],
      defaultSearchColumns: ['@@nameTsv'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
    });
    return data;
  }

  

  @Get('/slug/:slug')
  @ApiDocs({ operation: 'Get Blog by Slug' })
  async getBySLug(
    @Param('slug') slug: string,
  ): Promise<IResponse<{ blog: BlogEntity | null; message: string }>> {
    const blog = await this.blogService.getOne({
      options: {
        where: {
          slug: slug,
          deletedAt: IsNull(),
        },
        relations: {
          category: true,
          image: true,
        },
      },
    });

    return {
      data: {
        blog,
        message: 'Blog retrieved successfully',
      },
    };
  }

  @Get('/list-by-author/:id')
  @ApiDocs({ operation: 'List Blogs for Logged-in Author' })
  async listByAuthor(
    @Param() params: IdParamDto,
  ): Promise<IResponsePaging<BlogEntity>> {
    return this.blogService.paginatedGet({
      options: {
        where: { authorId: params.id },
        withDeleted: false,
        relations: { author: true, category: true, image: true },
      },
    });
  }

  @Get('/:id')
  @ApiDocs({ operation: 'Get Blog by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: BlogEntity | null; message: string }>> {
    const blog = await this.blogService.getById(params.id, {
      options: { relations: { author: true, category: true, image: true } },
    });
    if (!blog) {
      return {
        data: {
          item: null,
          message: 'Blog not found',
        },
      };
    }

    return {
      data: {
        item: blog,
        message: 'Blog retrieved successfully.',
      },
    };
  }

  
  
 
 
}
