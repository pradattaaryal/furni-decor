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
import { DataSource, QueryRunner } from 'typeorm';

import { ProductRatingCreateDto } from '../dto/product-rating.create.dto';
import { ProductRatingUpdateDto } from '../dto/product-rating.update.dto';
import { ProductRatingEntity } from '../entities/product-rating.entity';
import { ProductRatingService } from '../services/product-rating.service';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { IProductRatingEntity } from '../interfaces/product-rating.entity.interface';

@ApiTags('Product Rating')
@Controller('product-ratings')
@ApiBearerAuth('accessToken')
export class ProductRatingAdminController {
  constructor(
    private readonly productRatingService: ProductRatingService,
    private _connection: DataSource,
  ) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Product Rating' })
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: ProductRatingCreateDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createData = {
        ...body,
        userId: user.sub,
      };

      const rating = await this.productRatingService.create(createData, {
        entityManager: queryRunner.manager,
      });

      await queryRunner.commitTransaction();

      return {
        data: {
          rating,
          message: 'Product rated successfully',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update Product Rating' })
  @UseGuards(JwtAuthGuard)
  @RequestParamGuard(IdParamDto)
  async updateById(
    @Param('id') id: number,
    @Body() body: ProductRatingUpdateDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ rating: ProductRatingEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if rating exists and belongs to user
      const existingRating = await this.productRatingService.getById(id, {
        options: { relations: ['user', 'product'] },
        entityManager: queryRunner.manager,
      });

      if (!existingRating) {
        throw new NotFoundException('Product rating not found');
      }

      if (existingRating.userId !== user.sub) {
        throw new BadRequestException('You can only update your own ratings');
      }

      const updated = await this.productRatingService.update(id, body, {
        entityManager: queryRunner.manager,
      });

      await queryRunner.commitTransaction();

      return {
        data: {
          rating: updated,
          message: 'Product rating updated successfully',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

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

  @Delete('/hard-delete/:id')
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

 

}
