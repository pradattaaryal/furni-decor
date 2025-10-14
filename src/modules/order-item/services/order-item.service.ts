import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderItemEntity } from '../entities/order-item.entity';
import { CreateOrderItemDto } from '../dto/order-item.create.dto';

import { ProductService } from 'src/modules/products/services/product.service';
import { ProductVariantService } from 'src/modules/product-variants/services/product-variant.service';
import { OrderService } from 'src/modules/order/services/order.service';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import {
  IFindOneOptions,
  IPaginateFindOption,
} from 'src/common/database/interfaces/findOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { EntityManager } from 'typeorm';
import { ImageService } from 'src/modules/image/services/image.service';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly _orderItemRepo: OrderItemRepository,

    @Inject(forwardRef(() => OrderService))
    private readonly _orderService: OrderService,
    private readonly _productService: ProductService,
    private readonly _productVariantService: ProductVariantService,
    private readonly _imageService: ImageService,
  ) {}

  async create(
    dto: CreateOrderItemDto,
    options?: ICreateOptions,
  ): Promise<OrderItemEntity> {
    const { orderId, productId, variantId, quantity } = dto;

    const order = await this._orderService.getById(orderId);
    if (!order) throw new BadRequestException(`Order ${orderId} not found`);

    const product = await this._productService.getById(productId, {
      options: { relations: { images: true } },
    });
    if (!product)
      throw new BadRequestException(`Product ${productId} not found`);
    if (!variantId) {
      throw new NotFoundException(`Varient ${variantId}  not found`);
    }
    const variant = variantId
      ? await this._productVariantService.getById(variantId, {
          options: { relations: { color: true, image: true } },
        })
      : null;

    const productImage = product.images?.[0] ?? null;
    const variantImage = variant?.image ?? null;
    const price = product.price * quantity;

    const orderItemData: Partial<OrderItemEntity> = {
      order,
      orderId: order.id,
      productId: dto.productId,
      variantId: dto.variantId,
      color: variant?.color?.name ?? undefined,
      productName: product.name ?? 'Unknown Product',
      model: product.modelNumber ?? 'Unknown Model',
      dimensions: product.dimensions ?? {},
      warrantyServiceType: product.warrantyServiceType ?? '',
      warrantySummary: product.warrantySummary ?? '',
      coveredInWarranty: product.coveredInWarranty ?? '',
      notCoveredInWarranty: product.notCoveredInWarranty ?? '',
      domesticWarranty: product.domesticWarranty ?? '',
      productImage: productImage ?? null,
      varientImage: variantImage ?? null,
      quantity: dto.quantity ?? 1,
      price: dto.price ?? 0,
    };

    return this._orderItemRepo._create(orderItemData, options);
  }

  async getById(
    id: number,
    options?: IFindOneOptions<OrderItemEntity>,
  ): Promise<OrderItemEntity | null> {
    return this._orderItemRepo._findOneById(id, options);
  }
  async getImageById(
    imageId?: number,
    context?: string,
  ): Promise<ImageEntity | null> {
    if (!imageId) return null;

    const image = await this._imageService.getById(imageId);
    if (!image) {
      throw new NotFoundException(
        `${context ? context + ' ' : ''}Image with ID ${imageId} not found`,
      );
    }
    return image;
  }
  async softdelete(
    entity: OrderItemEntity,
    options?: IDeleteOptions<OrderItemEntity>,
  ): Promise<OrderItemEntity> {
    return this._orderItemRepo._softDelete(entity, options);
  }

  async paginatedGet(options?: IPaginateFindOption<OrderItemEntity>): Promise<{
    data: OrderItemEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._orderItemRepo._paginateFind(options);
  }

  async bulkCreateFromRepo(
    items: Partial<OrderItemEntity>[],
    options?: { entityManager?: EntityManager },
  ): Promise<void> {
    await this._orderItemRepo._createBulk(items, options);
  }
}
