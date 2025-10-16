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
  UseGuards,
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
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';

@ApiTags('Cart Items')
@Controller('/cart-items')
export class CartItemAdminController {
  constructor(
    private readonly cartItemService: CartItemService,
    private _connection: DataSource,
  ) {}
  @Post('/add-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiDocs({ operation: 'Add product to cart or increase quantity if exists' })
  async addOrUpdate(
    @Body() body: CreateCartItemDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: CartItemEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userId = user.sub;

      const item = await this.cartItemService.addOrUpdateCartItem(
        userId,
        body.productId,
        body.variantId,
        body.quantity,
        { entityManager: queryRunner.manager },
      );

      await queryRunner.commitTransaction();

      return {
        data: {
          item,
          message: 'Cart item added or updated successfully',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Get('/user-cart-items')
  @UseGuards(JwtAuthGuard)
  @ApiDocs({ operation: 'Get Cart by User ID' })
  async getCartByUserId(
    @Query() paginateQueryDto: PaginateQueryDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponsePaging<CartItemEntity>> {
    return await this.cartItemService.paginatedGet({
      ...paginateQueryDto,
      options: {
        where: { cart: { userId: user.sub } },
        withDeleted: false,
        relations: {
          product: { images: true },
          variant: { image: true },
        },
      },
      sortableColumns: ['id', 'createdAt'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
    });
  }

  // @Post('/create')
  // @UseGuards(JwtAuthGuard)
  // @ApiDocs({ operation: 'Add Product to Cart' })
  // async create(
  //   @Body() body: CreateCartItemDto,
  //   @GetUser() user: AccessTokenPayload,
  // ): Promise<IResponse<{ item: CartItemEntity; message: string }>> {
  //   const queryRunner: QueryRunner = this._connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const userId = user.sub;
  //     const item = await this.cartItemService.create(userId, body, {
  //       entityManager: queryRunner.manager,
  //     });

  //     await queryRunner.commitTransaction();

  //     return {
  //       data: {
  //         item,
  //         message: 'Cart Item created successfully',
  //       },
  //     };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

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

  // @Patch(':id')
  // @ApiDocs({ operation: 'Update Cart Item' })
  // async update(
  //   @Param() params: IdParamDto,
  //   @Body() updateDto: CartItemUpdateDto,
  // ): Promise<IResponse<{ item: CartItemEntity; message: string }>> {
  //   const queryRunner: QueryRunner = this._connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const updated = await this.cartItemService.update(params.id, updateDto, {
  //       entityManager: queryRunner.manager,
  //     });

  //     await queryRunner.commitTransaction();

  //     return {
  //       data: {
  //         item: updated,
  //         message: 'Cart Item updated successfully',
  //       },
  //     };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  @Delete('hard-delete/:id')
  @ApiDocs({ operation: 'Hard Delete Cart Item' })
  async hardDelete(
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

  @Patch('/decrement/:id')
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
  @Patch('/increment/:id')
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
