// services/order.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import {
  IFindOneOptions,
  IPaginateFindOption,
} from 'src/common/database/interfaces/findOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { CartService } from 'src/modules/cart/services/cart.service';
import { OrderItemService } from 'src/modules/order-item/services/order-item.service';
import { ShippingAddressService } from 'src/modules/shipping-address/services/shipping-address.service';
import { EntityManager, Repository } from 'typeorm';
import { ORDER_STATUS } from '../constant/order.constant';
import { CreateOrderDto } from '../dto/order.create.dto';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { CartItemService } from 'src/modules/cart-item/services/cart-item.service';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import { BillingAddressService } from 'src/modules/billing-address/services/billing-address.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly _orderBaseRepo: Repository<OrderEntity>,
    private readonly _shippingAddressService: ShippingAddressService,
    private readonly _billingAddressService: BillingAddressService,

    private readonly _cartService: CartService,
    private readonly _orderItemService: OrderItemService,
    private readonly _orderRepo: OrderRepository,
    private readonly _cartItemService: CartItemService,
  ) {}

  async createOrder(
    user_id: number,
    body: CreateOrderDto,
    total_price: number,
    options?: { entityManager?: EntityManager },
  ): Promise<OrderEntity> {
    const shippingAddress = await this._shippingAddressService.getById(
      body.shippingAddress,
    );

    const BillingAddress = await this._billingAddressService.getById(
      body.BillingAddress,
    );

    const cart = await this._cartService.findByUserId(user_id);

    if (!cart) {
      throw new NotFoundException(`Cart of user id ${user_id} not found`);
    }
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty, cannot create order');
    }

    const order = this._orderBaseRepo.create({
      userId: user_id,
      totalPrice: total_price,
      shippingAddress: shippingAddress,
      billingAddress: BillingAddress,
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
     return order;
  }
  // async clearCartRecursive(cart: CartEntity): Promise<void> {
  //   if (!cart) return;

  //   if (cart.items && cart.items.length) {
  //     await Promise.all(
  //       cart.items.map((item) => this._cartItemService.bulksoftDelete(item)),
  //     );
  //   }
  // }

  async getById(
    id: number,
    options?: IFindOneOptions<OrderEntity>,
  ): Promise<OrderEntity | null> {
    const data = await this._orderRepo._findOneById(id, options);
    return data;
  }

  async softdelete(
    entity: OrderEntity,
    options?: IDeleteOptions<OrderEntity>,
  ): Promise<OrderEntity> {
    return this._orderRepo._softDelete(entity, options);
  }
async getAllByUserId(userId: number): Promise<OrderEntity[]> {
  const { data: orders } = await this._orderRepo._paginateFind({options:{
    where: { userId },
    relations: {
      items: {
        productImage: true,
        varientImage: true,
      },
      shippingAddress: true,
      billingAddress: true,
    },
    order: { createdAt: 'DESC' },
  }});

  return orders;
}

  async paginatedGet(options?: IPaginateFindOption<OrderEntity>): Promise<{
    data: OrderEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._orderRepo._paginateFind(options);
  }

  async updateStatus(
    id: number,
    status: ORDER_STATUS,
  ): Promise<{ message: string; order: OrderEntity }> {
    const order = await this.getById(id);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.status = status;

    const updatedOrder = await this._orderRepo._update(order);

    return {
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    };
  }
}
