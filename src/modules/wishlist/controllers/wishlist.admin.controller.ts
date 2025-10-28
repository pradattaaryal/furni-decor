import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WishlistService } from '../services/wishlist.service';
import { WishlistEntity } from '../entities/wishlist.entity';
import { CreateWishlistDto } from '../dto/wishlist.create.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { UpdateWishlistDto } from '../dto/wishlist.update.dto';

@ApiTags('Wishlist')
@Controller('/wishlist')
export class WishlistAdminController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post('/create')
  @ApiDocs({ operation: 'Create Wishlist Entry' })
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDto: CreateWishlistDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: WishlistEntity; message: string }>> {
    const newWishlist = {
      ...createDto,
      userId: user.sub,
    };

    const item = await this.wishlistService.create(newWishlist);

    return {
      data: {
        item,
        message: 'Product added to wishlist successfully.',
      },
    };
  }

  @Get('/:id')
  @ApiDocs({ operation: 'Get Wishlist Entry by user ID' })
  @UseGuards(JwtAuthGuard)
  async getById(
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponsePaging<WishlistEntity>> {
    return this.wishlistService.paginatedGet({
      options: {
        where: { user: { id: user.sub } },
        relations: { product: { images: true }, variant: { image: true } },
      },
    });
  }
  @Delete('/:id')
  @ApiDocs({ operation: 'Remove product from wishlist' })
  @UseGuards(JwtAuthGuard)
  async deleteById(
    @Param('id') id: string,
  ): Promise<IResponse<{ item: WishlistEntity; message: string }>> {
    const item = await this.wishlistService.remove(id);

    return {
      data: {
        item,
        message: 'Wishlist removed successfully.',
      },
    };
  }

  @Get()
  @ApiDocs({ operation: 'Get Wishlist Count user ID' })
  @UseGuards(JwtAuthGuard)
  async getCount(
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ count: number; message: string }>> {
    const count = await this.wishlistService.getCount(user.sub);

    return {
      data: {
        count: count,
        message: 'Wishlist count retrieved successfully.'
      }
    }
  }


}
