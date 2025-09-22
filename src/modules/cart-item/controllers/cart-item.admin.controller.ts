import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartItemService } from '../services/cart-item.service';
import { CreateCartItemDto } from '../dto/cart-item.create.dto';
import { CartItemUpdateDto } from '../dto/cart-item.update.dto';
import { CartItemEntity } from '../entities/cart-item.entity';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { DataSource, QueryRunner } from 'typeorm';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { CartItemQuantityDto } from '../dto/cart-item.increment.dto';

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
        message: item
          ? 'Cart Item retrieved successfully'
          : 'Cart Item not found',
      },
    };
  }
  // @Get('cart/:cartId')
  // @ApiDocs({ operation: 'Get All Cart Items by Cart ID' })
  // async getAllByCartId(
  //   @Param('cartId') cartId: number,
  // ): Promise<IResponse<{ items: CartItemEntity[]; message: string }>> {
  //   const items = await this.cartItemService.getAllByCartId(cartId, {
  //     relations: { product: true, variant: true },
  //   });

  //   return {
  //     data: {
  //       items,
  //       message: items.length
  //         ? 'Cart items retrieved successfully'
  //         : 'No items found in this cart',
  //     },
  //   };
  // }

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
      const updated = await this.cartItemService.update(params.id, updateDto, {
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

  // @Delete('soft-delete/:id')
  // @ApiDocs({ operation: 'Soft Delete Cart Item' })
  // async softDelete(
  //   @Param() params: IdParamDto,
  // ): Promise<IResponse<{ item: CartItemEntity | null; message: string }>> {
  //   const item = await this.cartItemService.getById(params.id);
  //   if (!item) {
  //     return {
  //       data: {
  //         item: null,
  //         message: 'Cart Item not found',
  //       },
  //     };
  //   }

  //   const deleted = await this.cartItemService.softDelete(item);
  //   return {
  //     data: {
  //       item: deleted,
  //       message: 'Cart Item soft deleted successfully',
  //     },
  //   };
  // }

  @Delete('hard-delete/:id')
  @ApiDocs({ operation: 'Hard Delete Cart Item' })
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

    const deleted = await this.cartItemService.delete(item);
    return {
      data: {
        item: deleted,
        message: 'Cart Item Hard deleted successfully',
      },
    };
  }

  @Patch(':id/decrement')
  @ApiDocs({ operation: 'Decrease Cart Item Quantity' })
  async decrementQuantity(
    @Param('id') id: number,
    @Body() decrementDto: CartItemQuantityDto,
  ): Promise<IResponse<{ item: CartItemEntity | null; message: string }>> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedItem = await this.cartItemService.decrementQuantity(
        id,
        decrementDto,
        {
          entityManager: queryRunner.manager,
        },
      );

      await queryRunner.commitTransaction();

      return {
        data: {
          item: updatedItem,
          message: updatedItem
            ? 'Cart item quantity decreased successfully'
            : 'Cart item removed from cart',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  @Patch(':id/increment')
  @ApiDocs({ operation: 'Increase Cart Item Quantity' })
  async incrementQuantity(
    @Param('id') id: number,
    @Body() incrementDto: CartItemQuantityDto,
  ): Promise<IResponse<{ item: CartItemEntity; message: string }>> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedItem = await this.cartItemService.incrementQuantity(
        id,
        incrementDto,
        {
          entityManager: queryRunner.manager,
        },
      );

      await queryRunner.commitTransaction();

      return {
        data: {
          item: updatedItem,
          message: 'Cart item quantity increased successfully',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
