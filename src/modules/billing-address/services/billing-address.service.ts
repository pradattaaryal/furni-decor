import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BillingAddressEntity } from '../entities/billing-address.entity';
import { BillingAddressRepository } from '../repositories/billing-address.repository';
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
import { IBillingAddressEntity } from '../interfaces/billing-address.entity.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { UpdateResult } from 'typeorm';

@Injectable()
export class BillingAddressService {
  constructor(private readonly _billingAddressRepo: BillingAddressRepository) {}

  async create(
    createData: IBillingAddressEntity,
    options?: ICreateOptions,
  ): Promise<BillingAddressEntity> {
    try {
      const { userId, default: isDefault } = createData;

      // If this is set as default, unset other default addresses for this user
      if (isDefault) {
        await this._unsetDefaultAddresses(userId);
      }

      const entity: Partial<BillingAddressEntity> = {
        ...createData,
      };

      return await this._billingAddressRepo._create(entity, options);
    } catch (error) {
      throw new BadRequestException('Billing address not created');
    }
  }

  async getAll(
    userId: number,
    options?: IFindAllOptions<BillingAddressEntity>,
  ): Promise<BillingAddressEntity[]> {
    return await this._billingAddressRepo._findAll({
      options: { where: { userId } },
    });
  }

  async paginatedGet(
    options?: IPaginateFindOption<BillingAddressEntity>,
  ): Promise<{
    data: BillingAddressEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._billingAddressRepo._paginateFind(options);
  }

  async getById(
    id: number,
    options?: IFindOneOptions<BillingAddressEntity>,
  ): Promise<BillingAddressEntity> {
    const address = await this._billingAddressRepo._findOneById(id, options);
    if (!address) {
      throw new NotFoundException('Billing address not found');
    }
    return address;
  }

  async restore(
    options: IUpdateRawOptions<BillingAddressEntity>,
  ): Promise<UpdateResult | null> {
    return await this._billingAddressRepo._restoreRaw(options);
  }

  async update(
    id: number,
    updateData: Partial<IBillingAddressEntity>,
    options?: IUpdateOptions<BillingAddressEntity>,
  ): Promise<BillingAddressEntity> {
    const existing = await this._billingAddressRepo._findOneById(id, options);
    if (!existing) {
      throw new NotFoundException(`Billing address with ID ${id} not found`);
    }

    // If setting as default, unset other default addresses for this user
    if (updateData.default && existing.userId) {
      await this._unsetDefaultAddresses(existing.userId);
    }

    Object.assign(existing, updateData);

    return await this._billingAddressRepo._update(existing, options);
  }

  async setDefault(
    id: number,
    userId: number,
    options?: IUpdateOptions<BillingAddressEntity>,
  ): Promise<BillingAddressEntity> {
    try {
      const address = await this._billingAddressRepo._findOneById(id, options);
      if (!address || address.userId !== userId) {
        throw new NotFoundException('Billing address not found');
      }

      // Unset other default addresses for this user
      await this._unsetDefaultAddresses(userId);

      address.default = true;
      return await this._billingAddressRepo._update(address, options);
    } catch (error) {
      throw new BadRequestException(
        'Error while setting billing address as default:',
        error,
      );
    }
  }

  async delete(
    entity: BillingAddressEntity,
    options?: IDeleteOptions<BillingAddressEntity>,
  ): Promise<BillingAddressEntity> {
    return await this._billingAddressRepo._delete(entity, options);
  }

  async softDelete(
    entity: BillingAddressEntity,
    options?: IUpdateOptions<BillingAddressEntity>,
  ): Promise<BillingAddressEntity> {
    return await this._billingAddressRepo._softDelete(entity, options);
  }

  private async _unsetDefaultAddresses(userId: number): Promise<void> {
    const defaultAddress = await this._billingAddressRepo._findOne({
      options: { where: { userId, default: true }, withDeleted: false },
    });

    if (defaultAddress) {
      defaultAddress.default = false;
      await this._billingAddressRepo._update(defaultAddress);
    }
  }
}
