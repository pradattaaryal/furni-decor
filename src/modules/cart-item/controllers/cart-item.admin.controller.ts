import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartItemService } from '../services/cart-item.service';
import { CreateCartItemDto } from '../dto/cart-item.create.dto';
import { CartItemUpdateDto } from '../dto/cart-item.update.dto';
import { CartItemEntity } from '../entities/cart-item.entity';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { DataSource, QueryRunner } from 'typeorm';

@ApiTags('Cart Items')
@Controller('/cart-items')
export class CartItemAdminController {
  constructor(
    private readonly cartItemService: CartItemService,
    private _connection: DataSource,
  ) {}
 @Post('/create')
  @ApiDocs({ operation: 'Add Product to Cart' })
  async create(
    @Body() body: CreateCartItemDto,
  ): Promise<IResponse<{ item: CartItemEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const item = await this.cartItemService.create(body, {
        entityManager: queryRunner.manager,
      });

      await queryRunner.commitTransaction();

      return {
        data: {
          item,
          message: 'Cart Item created successfully',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Cart Item by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: CartItemEntity | null; message: string }>> {
    const item = await this.cartItemService.getById(params.id, {
      relations: { cart: true, product: true, variant: true },
    });

    return {
      data: {
        item,
        message: item ? 'Cart Item retrieved successfully' : 'Cart Item not found',
      },
    };
  }

 
  @Patch(':id')
  @ApiDocs({ operation: 'Update Cart Item' })
  async update(
    @Param() params: IdParamDto,
    @Body() updateDto: CartItemUpdateDto,
  ): Promise<IResponse<{ item: CartItemEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existing = await this.cartItemService.getById(params.id, {
        entityManager: queryRunner.manager,
      });
      if (!existing) {
        throw new NotFoundException('Cart Item not found');
      }

      const updated = await this.cartItemService.update(existing, updateDto, {
        entityManager: queryRunner.manager,
      });

      await queryRunner.commitTransaction();

      return {
        data: {
          item: updated,
          message: 'Cart Item updated successfully',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Delete('soft-delete/:id')
  @ApiDocs({ operation: 'Soft Delete Cart Item' })
  async softDelete(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: CartItemEntity | null; message: string }>> {
    const item = await this.cartItemService.getById(params.id);
    if (!item) {
      return {
        data: {
          item: null,
          message: 'Cart Item not found',
        },
      };
    }

    const deleted = await this.cartItemService.softDelete(item);
    return {
      data: {
        item: deleted,
        message: 'Cart Item soft deleted successfully',
      },
    };
  }
}
