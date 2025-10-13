import { Injectable, NotFoundException } from '@nestjs/common';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from 'src/common/database/interfaces/findOption.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { SelectQueryBuilder, UpdateResult } from 'typeorm';
import { ColorCreateDto } from '../dto/color.create.dto';
import { ColorEntity } from '../entities/color.entity';
import { IColorUpdateDto } from '../interfaces/color.update.dto.interface';
import { ColorRepository } from '../repositories/color.repository';

@Injectable()
export class ColorService {
  constructor(private readonly _colorRepo: ColorRepository) {}

  async create(
    createDto: ColorCreateDto,
    options?: ICreateOptions,
  ): Promise<ColorEntity> {
    const data = await this._colorRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ColorEntity>,
  ): Promise<ColorEntity | null> {
    const data = await this._colorRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<ColorEntity>,
  ): Promise<ColorEntity | null> {
    const data = await this._colorRepo._findOne(options);
    return data;
  }

  async getOneOrFail(
    options: IFindOneOptions<ColorEntity>,
  ): Promise<ColorEntity> {
    const data = await this.getOne(options);
    if (!data) {
      throw new NotFoundException('Cannot find Color');
    }
    return data;
  }

  async getAll(options?: IFindAllOptions<ColorEntity>): Promise<ColorEntity[]> {
    return await this._colorRepo._findAll(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<ColorEntity> {
    return this._colorRepo.getRepo().createQueryBuilder(name);
  }

  async paginatedGet(options?: IPaginateFindOption<ColorEntity>): Promise<{
    data: ColorEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._colorRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: ColorEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._colorRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    color: ColorEntity,
    options?: IUpdateOptions<ColorEntity>,
  ): Promise<ColorEntity> {
    return await this._colorRepo._softDelete(color, options);
  }

  async delete(
    color: ColorEntity,
    options?: IDeleteOptions<ColorEntity>,
  ): Promise<ColorEntity> {
    return await this._colorRepo._delete(color, options);
  }

  async restore(
    options: IUpdateRawOptions<ColorEntity>,
  ): Promise<UpdateResult | null> {
    return await this._colorRepo._restoreRaw(options);
  }

  async update(
    color: ColorEntity,
    updateData: IColorUpdateDto,
    options?: IUpdateOptions<ColorEntity>,
  ) {
    color = Object.assign(color, updateData);
    return await this._colorRepo._update(color, options);
  }
}
