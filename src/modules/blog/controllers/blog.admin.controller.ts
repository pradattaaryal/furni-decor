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

@ApiTags('Blog')
@Controller('/blogs')
export class BlogAdminController {
  constructor(private readonly blogService: BlogService) {}
  @Get('/list-all')
  @ApiDocs({ operation: 'List All Blogs' })
  @UseGuards(JwtAuthGuard)
  async listAll(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<BlogEntity>> {
    if (paginateQueryDto.searchBy == 'name') {
      paginateQueryDto.searchBy = '@@nameTsv';
    }
    return this.blogService.paginatedGet({
      ...paginateQueryDto,
      options: {
        withDeleted: false,
        relations: { author: true, category: true, image: true },
      },
      searchableColumns: ['@@nameTsv'],
      defaultSearchColumns: ['@@nameTsv'],
    });
  }

  @Post('/create')
  @ApiDocs({ operation: 'Create Blog' })
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDto: CreateBlogDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: BlogEntity; message: string }>> {
    const newBlog = {
      ...createDto,
      authorId: user.sub,
    };

    const item = await this.blogService.create(newBlog);

    return {
      data: {
        item,
        message: 'Blog created successfully.',
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
  @UseGuards(JwtAuthGuard)
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

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update Blog' })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param() params: IdParamDto,
    @Body() updateDto: CreateBlogDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: BlogEntity; message: string }>> {
    const blog = await this.blogService.getById(params.id);
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }

     if (blog.authorId !== user.sub) {
      throw new BadRequestException('Unauthorized to update this blog');
    }

    const updatedBlog = await this.blogService.update(blog, updateDto);
    return {
      data: {
        item: updatedBlog,
        message: 'Blog updated successfully.',
      },
    };
  }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft Delete Blog' })
  @UseGuards(JwtAuthGuard)
  async softDelete(
    @Param() params: IdParamDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ blog: BlogEntity | null; message: string }>> {
    const blog = await this.blogService.getById(params.id);
    if (!blog) {
      return {
        data: {
          blog: null,
          message: 'Blog not found',
        },
      };
    }

     if (blog.authorId !== user.sub) {
      throw new BadRequestException('Unauthorized to delete this blog');
    }

    const deletedBlog = await this.blogService.softDelete(blog);
    return {
      data: {
        blog: deletedBlog,
        message: 'Blog soft deleted successfully.',
      },
    };
  }

  @Delete('/hard-delete/:id')
  @ApiDocs({ operation: 'Hard Delete Blog' })
  @UseGuards(JwtAuthGuard)
  async hardDelete(
    @Param() params: IdParamDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ blog: BlogEntity | null; message: string }>> {
    const blog = await this.blogService.getById(params.id);
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }

     if (blog.authorId !== user.sub) {
      throw new BadRequestException('Unauthorized to delete this blog');
    }

    const deletedBlog = await this.blogService.delete(blog);
    return {
      data: {
        blog: deletedBlog,
        message: 'Blog hard deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore Blog' })
  @UseGuards(JwtAuthGuard)
  async restore(
    @Param() params: IdParamDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ blog: BlogEntity | null; message: string }>> {
    const restoreResult = await this.blogService.restore({
      where: { id: params.id, authorId: user.sub },
    });

    if (!restoreResult || restoreResult.affected === 0) {
      return {
        data: {
          blog: null,
          message: 'Blog not found or already restored',
        },
      };
    }

    const restoredBlog = await this.blogService.getById(params.id);
    return {
      data: {
        blog: restoredBlog,
        message: 'Blog restored successfully.',
      },
    };
  }
}
