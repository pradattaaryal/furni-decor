// controllers/product.admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  NotFoundException,
  Param,
  Patch,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';

import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { ProductVariantUpdateDto } from '../dto/update-product-variant.dto';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductVariantService } from '../services/product-variant.service';

@ApiTags('Product Varient')
@Controller('ProductVarient')
@ApiBearerAuth('accessToken')
export class ProductVarientAdminController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Patch('/update/:id')
  @ApiDocs({ operation: 'Update ProductVarient' })
  @RequestParamGuard(IdParamDto)
  async updateById(
    @Param('id') id: number,
    @Body() updateProductVarientData: ProductVariantUpdateDto,
  ): Promise<IResponse<{ product: ProductVariantEntity; message: string }>> {
    const found = await this.productVariantService.getById(id);
    if (!found) throw new NotFoundException('Cannot find ProductVarient');

    const updated = await this.productVariantService.update(
      found,
      updateProductVarientData,
    );
    return {
      data: {
        product: updated,
        message: 'ProductVarient updated successfully.',
      },
    };
  }
}
