import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import { CreateCartDto } from '../dto/cart.create.dto';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { CartEntity } from '../entities/cart.entity';
import { CartService } from '../services/cart.service';
import { UserService } from 'src/modules/user/services/user.service';
import { UpdateCartDto } from '../dto/cart.update.dto';
import { object } from 'joi';

@ApiTags('Cart')
@Controller('carts')
@ApiBearerAuth('accessToken')
export class CartAdminController {
  constructor(
    private readonly cartService: CartService,
    private readonly _userService: UserService,
  ) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Cart' })
  async create(
    @Body() body: CreateCartDto,
  ): Promise<IResponse<{ cart: CartEntity; message: string }>> {
    const user = await this._userService.getById(body.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.verified) {
      throw new BadRequestException('User is not verified ');
    }
    const cart = await this.cartService.create(body);
    return {
      data: {
        cart,
        message: 'Cart created successfully.',
      },
    };
  }
  //   @Post('/update')
  // @ApiDocs({ operation: 'Update Cart' })
  // async update(
  //   @Body() body: UpdateCartDto,
  // ): Promise<IResponse<{ cart: CartEntity; message: string }>> {
  //   //const cart = await this.cartService.Update(body);
  //    return {
  //     data: {
  //       cart,
  //       message: 'Cart created successfully.',
  //     },
  //   };
  // }
}
