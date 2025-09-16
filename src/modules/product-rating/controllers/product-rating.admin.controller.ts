import {
  Controller,
  Get,
  Post,
  Delete,
  NotFoundException,
  Param,
  Patch,
  Body,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';

import { ProductRatingCreateDto } from '../dto/product-rating.create.dto';
import { ProductRatingEntity } from '../entities/product-rating.entity';
import { ProductRatingService } from '../services/product-rating.service';
import { IProductRatingCreateDto } from '../interfaces/product-rating.create.dto.interface';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';

@ApiTags('Product Rating ')
@Controller('product-ratings')
@ApiBearerAuth('accessToken')
export class ProductRatingAdminController {
  constructor(private readonly productRatingService: ProductRatingService) {}

  @Get('/list')
  @ApiDocs({ operation: 'List Product Ratings' })
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<ProductRatingEntity>> {
    return this.productRatingService.paginatedGet({
      ...paginateQueryDto,

      defaultSortColumn: 'id',
      sortableColumns: ['createdAt', 'id', 'rating'],
      options: {
        relations: ['product', 'user'],
      },
    });
  }
  @Post('/create')
  @ApiDocs({ operation: 'Create Product Rating' })
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: ProductRatingCreateDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
    const product = await this.productRatingService.validateProduct(
      body.productId,
    );
    if (!product) {
      throw new BadRequestException(
        `${body.productId} is not a valid Product Id!`,
      );
    }

    const createData: IProductRatingCreateDto = {
      ...body,
      userId: user.sub.toString(),
      isApproved: false,
    };

    const rating = await this.productRatingService.create(createData);

    return {
      data: {
        rating,
        message: 'Product rated successfully.',
      },
    };
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Product Rating' })
  @RequestParamGuard(IdParamDto)
  async getById(
    @Param('id') id: number,
  ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
    const rating = await this.productRatingService.getById(id, {
      options: { relations: ['product', 'user'] },
    });
    if (!rating) throw new NotFoundException('Cannot find Product Rating');
    return {
      data: {
        rating,
        message: 'Product Rating retrieved successfully.',
      },
    };
  }

  // @Patch('/update/:id')
  // @ApiDocs({ operation: 'Update Product Rating' })
  // @RequestParamGuard(IdParamDto)
  // async updateById(
  //   @Param('id') id: number,
  //   @Body() body: Partial<ProductRatingCreateDto>,
  // ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
  //   const found = await this.productRatingService.getById(id);
  //   if (!found) throw new NotFoundException('Cannot find Product Rating');

  //   const updated = await this.productRatingService.update(found, body);
  //   return {
  //     data: {
  //       rating: updated,
  //       message: 'Product Rating updated successfully.',
  //     },
  //   };
  // }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft delete Product Rating' })
  async softDeleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
    const found = await this.productRatingService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Product Rating');

    const rating = await this.productRatingService.softDelete(found);
    return {
      data: {
        rating,
        message: 'Product Rating soft deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore Product Rating' })
  async restoreById(
    @Param('id') id: number,
  ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
    await this.productRatingService.restore({ where: { id } });
    const rating = await this.productRatingService.getById(id);
    if (!rating) throw new NotFoundException('Cannot find Product Rating');
    return {
      data: {
        rating,
        message: 'Product Rating restored successfully.',
      },
    };
  }

  @Delete('/hard/:id')
  @ApiDocs({ operation: 'Hard delete Product Rating' })
  async deleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
    const found = await this.productRatingService.getById(id);
    if (!found) throw new NotFoundException('Cannot find Product Rating');

    const rating = await this.productRatingService.delete(found);
    return {
      data: {
        rating,
        message: 'Product Rating permanently deleted successfully.',
      },
    };
  }

  //   @Patch('/approve/:id')
  // @ApiDocs({ operation: 'Approve Product Rating' })
  // @RequestParamGuard(IdParamDto)
  // async approveById(
  //   @Param('id') id: number,
  // ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
  //   const found = await this.productRatingService.getById(id);
  //   if (!found) throw new NotFoundException('Cannot find Product Rating');

  //   if (found.isApproved) {
  //     throw new BadRequestException('This Product Rating is already approved.');
  //   }

  //   const updated = await this.productRatingService.update(found, {
  //     isApproved: true,
  //   });

  //   return {
  //     data: {
  //       rating: updated,
  //       message: 'Product Rating approved successfully.',
  //     },
  //   };
  // }
}
