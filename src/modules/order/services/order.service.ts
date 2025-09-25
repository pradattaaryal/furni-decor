// services/order.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IFindOneOptions } from 'src/common/database/interfaces/findOption.interface';
import { CartService } from 'src/modules/cart/services/cart.service';
import { ShippingAddressService } from 'src/modules/shipping-address/services/shipping-address.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/order.create.dto';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemEntity } from 'src/modules/order-item/entities/order-item.entity';
import { OrderItemService } from 'src/modules/order-item/services/order-item.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderItemDto } from 'src/modules/order-item/dto/order-item.create.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly _orderBaseRepo: Repository<OrderEntity>,
    private readonly _shippingAddressService: ShippingAddressService,
    private readonly _cartService: CartService,
    private readonly _orderItemService: OrderItemService,
    private readonly _orderRepo: OrderRepository,
  ) { }

  async createOrderWithoutItems(
    user_id,
    dto: CreateOrderDto,
    options?: { entityManager?: EntityManager },
  ): Promise<OrderEntity> {
    const shippingAddress = await this._shippingAddressService.getById(
      dto.shippingAddress,
    );
    if (!shippingAddress) {
      throw new NotFoundException('Shipping address not found');
    }

    const cart = await this._cartService.findByUserId(user_id);

    if (!cart) {
      throw new NotFoundException('Cart not aaaaaaaa found');
    }
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty, cannot create order');
    }

    const order = this._orderBaseRepo.create({
      userId: user_id,
      totalPrice: cart.totalPrice,
      shippingAddress,
    });
    await this._orderBaseRepo.save(order);
    const bulkOrderItems = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.product?.price,
    
    }));
    for (const item of bulkOrderItems) {
      await this._orderItemService.create(item, options);
    }
    await this._cartService.softDelete(cart)
    return order;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<OrderEntity>,
  ): Promise<OrderEntity | null> {
    const data = await this._orderRepo._findOneById(id, options);
    return data;
  }
}
