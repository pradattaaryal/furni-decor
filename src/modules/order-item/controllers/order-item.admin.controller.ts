import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource, QueryRunner } from 'typeorm';
import { OrderItemService } from '../services/order-item.service';
import { CreateOrderItemDto } from '../dto/order-item.create.dto';
import { OrderItemEntity } from '../entities/order-item.entity';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';

@ApiTags('Order Items')
@Controller('/order-items')
export class OrderItemAdminController {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly _connection: DataSource,
  ) {}

  @Post('/create')
  @ApiDocs({ operation: 'Add Product to Order' })
  async create(
    @Body() body: CreateOrderItemDto,
  ): Promise<IResponse<{ item: OrderItemEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const item = await this.orderItemService.create(body, {
        entityManager: queryRunner.manager,
      });
      await queryRunner.commitTransaction();

      return {
        data: { item, message: 'Order Item created successfully' },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Get(':id')
  @ApiDocs({ operation: 'Get Order Item by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: OrderItemEntity | null; message: string }>> {
    const item = await this.orderItemService.getById(params.id, {
      relations: { order: true},
    });
    return {
      data: {
        item,
        message: item
          ? 'Order Item retrieved successfully'
          : 'Order Item not found',
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
    const deleted = await this.orderItemService.delete(item);
    return {
      data: { item: deleted, message: 'Order Item deleted successfully' },
    };
  }
}
