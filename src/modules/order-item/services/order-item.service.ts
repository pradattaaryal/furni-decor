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
import { IFindOneOptions } from 'src/common/database/interfaces/findOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { EntityManager } from 'typeorm';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly _orderItemRepo: OrderItemRepository,

    @Inject(forwardRef(() => OrderService))
    private readonly _orderService: OrderService,
    private readonly _productService: ProductService,
    private readonly _productVariantService: ProductVariantService,
  ) { }

  async create(
    dto: CreateOrderItemDto,
    options?: ICreateOptions,
  ): Promise<OrderItemEntity> {
    const { orderId, productId, variantId, quantity } = dto;

    const order = await this._orderService.getById(orderId);
    if (!order) throw new BadRequestException(`Order ${orderId} not found`);

    const product = await this._productService.getById(productId);
    if (!product)
      throw new BadRequestException(`Product ${productId} not found`);

    let variant;
    if (variantId) {
      variant = await this._productVariantService.getById(variantId);
      if (!variant) {
        throw new BadRequestException(`Variant ${variantId} not found`);
      }
      if (variant.quantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock for variant ${variantId}`,
        );
      }
    }

    const price = product.price * quantity;

    const orderItemData: Partial<OrderItemEntity> = {
      order,
      orderId,
      product,
      productId,
      variant,
      variantId,
      quantity,
      price,
    };

    return this._orderItemRepo._create(orderItemData, options);
  }

  async getById(
    id: number,
    options?: IFindOneOptions<OrderItemEntity>,
  ): Promise<OrderItemEntity | null> {
    return this._orderItemRepo._findOneById(id, options);
  }

  async delete(
    entity: OrderItemEntity,
    options?: IDeleteOptions<OrderItemEntity>,
  ): Promise<OrderItemEntity> {
    return this._orderItemRepo._delete(entity, options);
  }
 async bulkCreateFromRepo(
    items: Partial<OrderItemEntity>[],
    options?: { entityManager?: EntityManager },
  ): Promise<void> {
    await this._orderItemRepo._createBulk(items, options);
  }
 
}
