import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource, QueryRunner } from 'typeorm';
import { OrderItemService } from '../services/order-item.service';
import { CreateOrderItemDto } from '../dto/order-item.create.dto';
import { OrderItemEntity } from '../entities/order-item.entity';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { IResponse, IResponsePaging } from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';

@ApiTags('Order Items')
@Controller('/order-items')
export class OrderItemAdminController {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly _connection: DataSource,
  ) {}
 
   @Get('/user-cart-items')
   @UseGuards(JwtAuthGuard)
   @ApiDocs({ operation: 'Get order by User ID' })
   async getCartByUserId(
     @Query() paginateQueryDto: PaginateQueryDto,
     @GetUser() user: AccessTokenPayload,
   ): Promise<IResponsePaging<OrderItemEntity>> {
     return await this.orderItemService.paginatedGet({
       ...paginateQueryDto,
       options: {
         where: { order: { userId: user.sub } },
         withDeleted: false,
         relations: {
           
            
         },
       },
       sortableColumns: ['id', 'createdAt'],
       defaultSortColumn: 'createdAt',
       defaultSortOrder: 'DESC',
     });
   }

 
  @Get(':id')
  @ApiDocs({ operation: 'Get Order Item by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: OrderItemEntity | null; message: string }>> {
    const item = await this.orderItemService.getById(params.id, {
      relations: { order: true },
    });
    return {
      data: {
        item,
        message: 'Order Item retrieved successfully'
            
         
      },
    };
  }

  @Delete(':id')
  @ApiDocs({ operation: 'Delete Order Item' })
  async delete(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: OrderItemEntity | null; message: string }>> {
    const item = await this.orderItemService.getById(params.id);
    if (!item) {
      return {
        data: { item: null, message: 'Order Item not found' },
      };
    }
    const deleted = await this.orderItemService.softdelete(item);
    return {
      data: { item: deleted, message: 'Order Item deleted successfully' },
    };
  }
} 
