import {
  Controller,
  Post,
  Body,
  NotFoundException,
  UseGuards,
  Get,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrderEntity } from '../entities/order.entity';
import { ApiDocs } from 'src/common/doc/common-docs';
import { DataSource, QueryRunner } from 'typeorm';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/order.create.dto';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { OrderItemEntity } from 'src/modules/order-item/entities/order-item.entity';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { tr } from '@faker-js/faker';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { UpdateOrderStatusDto } from '../dto/order.update.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderMarketingController {
  constructor(
    private readonly _orderService: OrderService,
    private _connection: DataSource,
  ) {}

  @Get('/list')
  @ApiDocs({ operation: 'List Order' })
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<OrderEntity>> {
    return this._orderService.paginatedGet({
      ...paginateQueryDto,
      defaultSortColumn: 'id',
      sortableColumns: ['createdAt', 'id'],
      options: {
        where: {},
        relations: { items: true },
      },
    });
  }

  @Patch('/update-status/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this._orderService.updateStatus(id, updateStatusDto.status);
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Order by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: OrderEntity | null; message: string }>> {
    const item = await this._orderService.getById(params.id, {
      options: {
        relations: {
          items: true,
        },
      },
    });
    return {
      data: {
        item,
        message: 'Order retrieved successfully',
      },
    };
  }
@Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiDocs({ operation: 'Get Order by User ID' })
  async getOrderByUserId(
    @Param() params: IdParamDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: any; message: string }>> {
    const item = await this._orderService.paginatedGet( {options: {
        relations: {
          items: true,
        },
        where:{
          userId: user.sub
        }
      },});
    return {
      data: {
        item,
        message: 'Order retrieved successfully',
      },
    };
  }
  @Delete(':id')
  @ApiDocs({ operation: 'soft Delete Order ' })
  async delete(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: OrderEntity | null; message: string }>> {
    const item = await this._orderService.getById(params.id);
    if (!item) {
      return {
        data: { item: null, message: 'Order Item not found' },
      };
    }
    const deleted = await this._orderService.softdelete(item);
    return {
      data: { item: deleted, message: 'Order Item deleted successfully' },
    };
  }
}
