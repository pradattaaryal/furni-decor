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
import { ShippingAddressService } from '../services/shipping-address.service';
import { CreateShippingAddressDto } from '../dto/shipping-address.create.dto';
import { ShippingAddressEntity } from '../entities/shipping-address.entity';
import { IResponse, IResponsePaging } from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';

@ApiTags('Shipping Address')
@Controller('/shipping-address')
export class ShippingAddressAdminController {
  constructor(private readonly shippingAddressService: ShippingAddressService) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Shipping Address' })
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDto: CreateShippingAddressDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: ShippingAddressEntity; message: string }>> {
    const newAddress = {
      ...createDto,
      userId: user.sub,
    };

    const item = await this.shippingAddressService.create(newAddress);

    return {
      data: {
        item,
        message: 'Shipping address created successfully.',
      },
    };
  }

  @Get('/listByUserID')
  @ApiDocs({ operation: 'List Shipping Addresses for Logged-in User' })
  @UseGuards(JwtAuthGuard)
  async listByUser(
    @Query() paginateQuery: PaginateQueryDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponsePaging<ShippingAddressEntity>> {
    return this.shippingAddressService.paginatedGet({
      ...paginateQuery,
      options: { where: { userId: user.sub }, withDeleted: false },
    });
  }

  @Get('/listAll')
  @ApiDocs({ operation: 'List All Shipping Addresses' })
  @UseGuards(JwtAuthGuard)
  async listAll(
    @Query() paginateQuery: PaginateQueryDto,
  ): Promise<IResponsePaging<ShippingAddressEntity>> {
    return this.shippingAddressService.paginatedGet({
      ...paginateQuery,
      options: { withDeleted: false },
    });
  }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft Delete Shipping Address' })
  async softDelete(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ shippingAddress: ShippingAddressEntity | null; message: string }>> {
    const address = await this.shippingAddressService.getById(params.id);
    if (!address) {
      return {
        data: {
          shippingAddress: null,
          message: 'Shipping address not found',
        },
      };
    }

    const deletedAddress = await this.shippingAddressService.softDelete(address);
    return {
      data: {
        shippingAddress: deletedAddress,
        message: 'Shipping address soft deleted successfully.',
      },
    };
  }

  @Delete('/hard-delete/:id')
  @ApiDocs({ operation: 'Hard Delete Shipping Address' })
  async hardDelete(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ shippingAddress: ShippingAddressEntity | null; message: string }>> {
    const address = await this.shippingAddressService.getById(params.id);
    if (!address) {
      throw new BadRequestException('Shipping address not found');
    }

    const deletedAddress = await this.shippingAddressService.delete(address);
    return {
      data: {
        shippingAddress: deletedAddress,
        message: 'Shipping address hard deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore Shipping Address' })
  async restore(
    @Param() params: IdParamDto,
  ): Promise<IResponse<{ shippingAddress: ShippingAddressEntity | null; message: string }>> {
    const restoreResult = await this.shippingAddressService.restore({
      where: { id: params.id },
    });

    if (!restoreResult || restoreResult.affected === 0) {
      return {
        data: {
          shippingAddress: null,
          message: 'Shipping address not found or already restored',
        },
      };
    }

    const restoredAddress = await this.shippingAddressService.getById(params.id);
    return {
      data: {
        shippingAddress: restoredAddress,
        message: 'Shipping address restored successfully.',
      },
    };
  }

  @Patch('/:id/set-default')
  @ApiDocs({ operation: 'Set Shipping Address as Default' })
  @UseGuards(JwtAuthGuard)
  async setDefault(
    @Param() params: IdParamDto,
    @GetUser() user: AccessTokenPayload,
  ): Promise<IResponse<{ item: ShippingAddressEntity; message: string }>> {
    const item = await this.shippingAddressService.setDefault(params.id, user.sub);

    return {
      data: {
        item,
        message: 'Shipping address set as default successfully.',
      },
    };
  }
}
