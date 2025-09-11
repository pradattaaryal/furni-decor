import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductCreateDto } from '../dto/create-product.dto';
import { ProductUpdateDto } from '../dto/update-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { IResponse, IResponsePaging } from 'src/common/response/interfaces/response.interface';
import { ApiDocs } from 'src/common/doc/common-docs';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';

@ApiTags('Products')
@Controller({
  version: '1',
  path: '/products',
})
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Product' })
  async create(@Body() body: ProductCreateDto): Promise<IResponse<{ product: ProductEntity; message: string }>> {
    // Validate category_id
    const category = await this.productService.getOne({ options: { where: { id: body.categoryId } } });
    if (!category) {
      throw new BadRequestException(`${body.categoryId} is not a valid Category Id!`);
    }

    const product = await this.productService.create(body);
    return {
      data: {
        product,
        message: 'Product created successfully',
      },
    };
  }

  @Get('/list')
  @ApiDocs({ operation: 'List Products' })
  async list(@Query() paginateQueryDto: PaginateQueryDto): Promise<IResponsePaging<ProductEntity>> {
    return this.productService.paginatedGet({
      ...paginateQueryDto,
      relations: { category: true },
      searchableColumns: ['name', 'description'],
      sortableColumns: ['id', 'name', 'createdAt'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
    });
  }

  @Get('/:id')
  @ApiDocs({ operation: 'Get Product by ID' })
  async getById(@Param() params: IdParamDto): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this.productService.fetchProduct(params.id);
    return {
      data: {
        product,
        message: product ? 'Product retrieved successfully' : 'Product not found',
      },
    };
  }

  @Patch('/:id')
  @ApiDocs({ operation: 'Update Product' })
  async updateById(
    @Param() params: IdParamDto,
    @Body() updateProductData: ProductUpdateDto,
  ): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const existingProduct = await this.productService.getById(params.id);
    if (!existingProduct) {
      return {
        data: {
          product: null,
          message: 'Product not found',
        },
      };
    }

    const updatedProduct = await this.productService.updateProduct(params.id, updateProductData);
    return {
      data: {
        product: updatedProduct,
        message: 'Product updated successfully',
      },
    };
  }

  @Delete('/:id/soft-delete')
  @ApiDocs({ operation: 'Soft Delete Product' })
  async softDeleteById(@Param() params: IdParamDto): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this.productService.getById(params.id);
    if (!product) {
      return {
        data: {
          product: null,
          message: 'Product not found',
        },
      };
    }

    const softDeletedProduct = await this.productService.softDelete(product);
    return {
      data: {
        product: softDeletedProduct,
        message: 'Product soft deleted successfully',
      },
    };
  }

  @Patch('/:id/restore')
  @ApiDocs({ operation: 'Restore Product' })
  async restoreById(@Param() params: IdParamDto): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const restoreResult = await this.productService.restore({ where: { id: params.id } });
    if (!restoreResult || restoreResult.affected === 0) {
      return {
        data: {
          product: null,
          message: 'Product not found or already restored',
        },
      };
    }

    const restoredProduct = await this.productService.getById(params.id);
    return {
      data: {
        product: restoredProduct,
        message: 'Product restored successfully',
      },
    };
  }

  @Delete('/:id')
  @ApiDocs({ operation: 'Delete Product' })
  async deleteById(@Param() params: IdParamDto): Promise<IResponse<{ product: ProductEntity | null; message: string }>> {
    const product = await this.productService.getById(params.id);
    if (!product) {
      return {
        data: {
          product: null,
          message: 'Product not found',
        },
      };
    }

    const deletedProduct = await this.productService.delete(product);
    return {
      data: {
        product: deletedProduct,
        message: 'Product deleted successfully',
      },
    };
  }

  @Get('/category/:categoryId')
  @ApiDocs({ operation: 'Get Products by Category' })
  async getProductsByCategory(@Param('categoryId') categoryId: number): Promise<IResponse<{ products: ProductEntity[]; message: string }>> {
    const products = await this.productService.getProductsByCategory(categoryId);
    return {
      data: {
        products,
        message: 'Products retrieved successfully',
      },
    };
  }
}
