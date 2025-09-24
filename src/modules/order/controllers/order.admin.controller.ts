import {
  Controller,
  Post,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrderEntity } from '../entities/order.entity';
import { ApiDocs } from 'src/common/doc/common-docs';
import { DataSource, QueryRunner } from 'typeorm';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/order.create.dto';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrderAdminController {
  constructor(
    private readonly _orderService: OrderService,
    private _connection: DataSource,
  ) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Order with Items' })
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateOrderDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ order: OrderEntity; message: string }>> {
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this._orderService.createOrderWithoutItems(
        user.sub,
        body,
        { entityManager: queryRunner.manager },
      );
      await queryRunner.commitTransaction();
      return {
        data: {
          order: order,
          message: 'Order created successfully',
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
