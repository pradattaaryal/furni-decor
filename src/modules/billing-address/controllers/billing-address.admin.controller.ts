import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillingAddressService } from '../services/billing-address.service';
import { BillingAddressEntity } from '../entities/billing-address.entity';
import { CreateBillingAddressDto } from '../dto/billing-address.create.dto';
import { UpdateBillingAddressDto } from '../dto/billing-address.update.dto';
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

@ApiTags('Billing Address')
@Controller('/billing-address')
@UseGuards(JwtAuthGuard)
export class BillingAddressAdminController {
  constructor(private readonly billingAddressService: BillingAddressService) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Billing Address' })
  async create(
    @Body() createDto: CreateBillingAddressDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: BillingAddressEntity; message: string }>> {
    const newBillingAddress = {
      ...createDto,
      userId: user.sub,
    };

    const item = await this.billingAddressService.create(newBillingAddress);

    return {
      data: {
        item,
        message: 'Billing address created successfully.',
      },
    };
  }

  @Get('/list-by-user')
  @ApiDocs({ operation: 'List Billing Addresses by User' })
  async listByUser(
    @Query() paginateQuery: PaginateQueryDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponsePaging<BillingAddressEntity>> {
    return this.billingAddressService.paginatedGet({
      options: {
        where: { userId: user.sub },
        relations: { user: true },
      },
      ...paginateQuery,
    });
  }

  @Get('/list-all')
  @ApiDocs({ operation: 'List All Billing Addresses' })
  async listAll(
    @Query() paginateQuery: PaginateQueryDto,
  ): Promise<IResponsePaging<BillingAddressEntity>> {
    return this.billingAddressService.paginatedGet({
      options: {
        relations: { user: true },
      },
      ...paginateQuery,
    });
  }

  @Get('/:id')
  @ApiDocs({ operation: 'Get Billing Address by ID' })
  async getById(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: BillingAddressEntity; message: string }>> {
    const item = await this.billingAddressService.getById(params.id, {
      relations: { user: true },
    });

    return {
      data: {
        item,
        message: 'Billing address retrieved successfully.',
      },
    };
  }

  @Patch('/:id')
  @ApiDocs({ operation: 'Update Billing Address' })
  async updateById(
    @Param() params: IdParamDto,
    @Body() updateDto: UpdateBillingAddressDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: BillingAddressEntity; message: string }>> {
    const item = await this.billingAddressService.update(params.id, updateDto);

    return {
      data: {
        item,
        message: 'Billing address updated successfully.',
      },
    };
  }

  @Patch('/:id/set-default')
  @ApiDocs({ operation: 'Set Billing Address as Default' })
  async setDefault(
    @Param() params: IdParamDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: BillingAddressEntity; message: string }>> {
    const item = await this.billingAddressService.setDefault(
      params.id,
      user.sub,
    );

    return {
      data: {
        item,
        message: 'Billing address set as default successfully.',
      },
    };
  }

  @Delete('/:id/soft-delete')
  @ApiDocs({ operation: 'Soft Delete Billing Address' })
  async softDelete(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: BillingAddressEntity; message: string }>> {
    const item = await this.billingAddressService.getById(params.id);
    const deletedItem = await this.billingAddressService.softDelete(item);

    return {
      data: {
        item: deletedItem,
        message: 'Billing address soft deleted successfully.',
      },
    };
  }

  @Delete('/:id/hard-delete')
  @ApiDocs({ operation: 'Hard Delete Billing Address' })
  async hardDelete(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: BillingAddressEntity; message: string }>> {
    const item = await this.billingAddressService.getById(params.id);
    const deletedItem = await this.billingAddressService.delete(item);

    return {
      data: {
        item: deletedItem,
        message: 'Billing address deleted successfully.',
      },
    };
  }

  @Patch('/:id/restore')
  @ApiDocs({ operation: 'Restore Billing Address' })
  async restore(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ item: BillingAddressEntity; message: string }>> {
    await this.billingAddressService.restore({
      where: { id: params.id },
    });

    const item = await this.billingAddressService.getById(params.id);

    return {
      data: {
        item,
        message: 'Billing address restored successfully.',
      },
    };
  }
}
