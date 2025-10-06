import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShippingAddressEntity } from '../entities/shipping-address.entity';
import { ShippingAddressRepository } from '../repositories/shipping-address.repository';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
} from 'src/common/database/interfaces/findOption.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { IShippingAddressEntity } from '../interfaces/shipping-address.emtity.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { UpdateResult } from 'typeorm';

@Injectable()
export class ShippingAddressService {
  constructor(
    private readonly _shippingAddressRepo: ShippingAddressRepository,
  ) {}

  async create(
    createData: IShippingAddressEntity,
    options?: ICreateOptions,
  ): Promise<ShippingAddressEntity> {
    try {
      const { userId, default: isDefault } = createData;

      const entity: Partial<ShippingAddressEntity> = {
        ...createData,
      };

      return await this._shippingAddressRepo._create(entity, options);
    } catch (error) {
      throw new BadRequestException('shipping address not created');
    }
  }

  async getAll(
    userId: number,
    options?: IFindAllOptions<ShippingAddressEntity>,
  ): Promise<ShippingAddressEntity[]> {
    return await this._shippingAddressRepo._findAll({
      options: { where: { userId } },
    });
  }
  async paginatedGet(
    options?: IPaginateFindOption<ShippingAddressEntity>,
  ): Promise<{
    data: ShippingAddressEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._shippingAddressRepo._paginateFind(options);
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ShippingAddressEntity>,
  ): Promise<ShippingAddressEntity> {
    const address = await this._shippingAddressRepo._findOneById(id, options);
    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }
    return address;
  }
  async restore(
    options: IUpdateRawOptions<ShippingAddressEntity>,
  ): Promise<UpdateResult | null> {
    return await this._shippingAddressRepo._restoreRaw(options);
  }
  async update(
    id: number,
    updateData: Partial<IShippingAddressEntity>,
    options?: IUpdateOptions<ShippingAddressEntity>,
  ): Promise<ShippingAddressEntity> {
    const existing = await this._shippingAddressRepo._findOneById(id, options);
    if (!existing) {
      throw new NotFoundException(`Shipping address with ID ${id} not found`);
    }

    Object.assign(existing, updateData);

    return await this._shippingAddressRepo._update(existing, options);
  }

  async setDefault(
    id: number,
    userId: number,
    options?: IUpdateOptions<ShippingAddressEntity>,
  ): Promise<ShippingAddressEntity> {
    try {
      const address = await this._shippingAddressRepo._findOneById(id, options);
      if (!address || address.userId !== userId) {
        throw new NotFoundException('Shipping address not found');
      }

      const defaultAddress = await this._shippingAddressRepo._findOne({
        options: { where: { userId, default: true }, withDeleted: false },
      });

      if (defaultAddress && defaultAddress.id !== id) {
        defaultAddress.default = false;
        await this._shippingAddressRepo._update(defaultAddress, options);
      }

      address.default = true;
      return await this._shippingAddressRepo._update(address, options);
    } catch (error) {
      throw new BadRequestException(
        'Error while setting shipping address as default:',
        error,
      );
      throw error;
    }
  }

  async delete(
    entity: ShippingAddressEntity,
    options?: IDeleteOptions<ShippingAddressEntity>,
  ): Promise<ShippingAddressEntity> {
    return await this._shippingAddressRepo._delete(entity, options);
  }

  async softDelete(
    entity: ShippingAddressEntity,
    options?: IUpdateOptions<ShippingAddressEntity>,
  ): Promise<ShippingAddressEntity> {
    return await this._shippingAddressRepo._softDelete(entity, options);
  }
}
