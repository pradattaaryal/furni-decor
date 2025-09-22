import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import { CreateCartDto } from '../dto/cart.create.dto';
import {
  IPaginationMeta,
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { CartEntity } from '../entities/cart.entity';
import { CartService } from '../services/cart.service';
import { UserService } from 'src/modules/user/services/user.service';
import { UpdateCartDto } from '../dto/cart.update.dto';
import { object } from 'joi';
import { IPaginateFindOption } from 'src/common/database/interfaces/findOption.interface';
import { CartRepository } from '../repositories/cart.repository';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';

@ApiTags('Cart')
@Controller('carts')
@ApiBearerAuth('accessToken')
export class CartAdminController {
  constructor(
    private readonly cartService: CartService,
    private readonly _userService: UserService,
  ) {}

  @Post('/update')
  @ApiDocs({ operation: 'Update Cart' })
  async update(
    @Body() body: UpdateCartDto,
  ): Promise<IResponse<{ cart: CartEntity; message: string }>> {
    const cart = await this.cartService.update(body);
    return {
      data: {
        cart,
        message: 'Cart updated successfully.',
      },
    };
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Cart by ID with Cart Items' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ cart: CartEntity | null; message: string }>> {
    const cart = await this.cartService.getById(params.id, {
      relations: {
        user: true,
        items: {
          product: {
            images: true,
          },
          variant: { image: true },
        },
      },
    });

    return {
      data: {
        cart,
        message: cart ? 'Cart retrieved successfully' : 'Cart not found',
      },
    };
  }
}
