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
import { ImageService } from 'src/modules/image/services/image.service';
import { ImageEntity } from 'src/modules/image/entities/image.entity';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly _orderItemRepo: OrderItemRepository,

    @Inject(forwardRef(() => OrderService))
    private readonly _orderService: OrderService,
    private readonly _productService: ProductService,
    private readonly _productVariantService: ProductVariantService,
    private readonly _imageService: ImageService

  ) { }

  async create(
    dto: CreateOrderItemDto,
    options?: ICreateOptions,
  ): Promise<OrderItemEntity> {
    const { orderId, productId, variantId, quantity } = dto;

    const order = await this._orderService.getById(orderId);
    if (!order) throw new BadRequestException(`Order ${orderId} not found`);

    const product = await this._productService.getById(productId, { options: { relations: { images: true } } });
    if (!product)
      throw new BadRequestException(`Product ${productId} not found`);
    console.log('product data:', JSON.stringify(product, null, 2));
    if (!variantId) { throw new NotFoundException(`Varient ${variantId}  not found`) }

    const productVarient = await this._productVariantService.getById(variantId, { options: { relations: { image: true } } });
    console.log(`product varient data: ${productVarient}`);
    if (!productVarient) {
      { throw new NotFoundException(`product varient not found`) }

    }
    if (productVarient.quantity < quantity) {
      throw new BadRequestException(
        `Insufficient stock for variant ${variantId}`,
      );
    }




    const productImage = await this.getImageById(product.images?.[0]?.id, `Product ${product.id}`);
    const variantImage = await this.getImageById(productVarient?.image?.id, `Variant ${productVarient?.id}`);


    const price = product.price * quantity;

    const orderItemData: Partial<OrderItemEntity> = {
      order,
      orderId: order.id,
      productId: dto.productId,
      color: productVarient.color,
      variantId: dto.variantId,
      productName: product.name ?? 'Unknown Product',
      model: product.modelNumber ?? 'Unknown Model',
      dimensions: productVarient?.dimensions ?? {},
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
  async getImageById(imageId?: number, context?: string): Promise<ImageEntity | null> {
    if (!imageId) return null;

    const image = await this._imageService.getById(imageId);
    if (!image) {
      throw new NotFoundException(`${context ? context + ' ' : ''}Image with ID ${imageId} not found`);
    }
    return image;
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
