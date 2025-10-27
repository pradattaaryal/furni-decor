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
import { HomePageBannerCreateDto } from '../dto/home-page-banner.create.dto';
import { HomePageBannerEntity } from '../entities/home-page-banner.entity';
import { IHomePageBannerUpdateDto } from '../interfaces/home-page-banner.update.dto.interface';
import { HomePageBannerRepository } from '../repositories/home-page-banner.repository';

@Injectable()
export class HomePageBannerService {
  constructor(
    private readonly _homePageBannerRepo: HomePageBannerRepository,
  ) {}

  async create(
    createDto: HomePageBannerCreateDto,
    options?: ICreateOptions,
  ): Promise<HomePageBannerEntity> {
    const data = await this._homePageBannerRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<HomePageBannerEntity>,
  ): Promise<HomePageBannerEntity | null> {
    const data = await this._homePageBannerRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<HomePageBannerEntity>,
  ): Promise<HomePageBannerEntity | null> {
    const data = await this._homePageBannerRepo._findOne(options);
    return data;
  }

  async getOneOrFail(
    options: IFindOneOptions<HomePageBannerEntity>,
  ): Promise<HomePageBannerEntity> {
    const data = await this.getOne(options);
    if (!data) {
      throw new NotFoundException('Cannot find Home Page Banner');
    }
    return data;
  }

  async getAll(
    options?: IFindAllOptions<HomePageBannerEntity>,
  ): Promise<HomePageBannerEntity[]> {
    return await this._homePageBannerRepo._findAll(options);
  }

  getQueryBuilder(
    name: string,
  ): SelectQueryBuilder<HomePageBannerEntity> {
    return this._homePageBannerRepo.getRepo().createQueryBuilder(name);
  }

  async paginatedGet(
    options?: IPaginateFindOption<HomePageBannerEntity>,
  ): Promise<{
    data: HomePageBannerEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._homePageBannerRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: HomePageBannerEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._homePageBannerRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    banner: HomePageBannerEntity,
    options?: IUpdateOptions<HomePageBannerEntity>,
  ): Promise<HomePageBannerEntity> {
    return await this._homePageBannerRepo._softDelete(banner, options);
  }

  async delete(
    banner: HomePageBannerEntity,
    options?: IDeleteOptions<HomePageBannerEntity>,
  ): Promise<HomePageBannerEntity> {
    return await this._homePageBannerRepo._delete(banner, options);
  }

  async restore(
    options: IUpdateRawOptions<HomePageBannerEntity>,
  ): Promise<UpdateResult | null> {
    return await this._homePageBannerRepo._restoreRaw(options);
  }

  async update(
    banner: HomePageBannerEntity,
    updateData: IHomePageBannerUpdateDto,
    options?: IUpdateOptions<HomePageBannerEntity>,
  ) {
    banner = Object.assign(banner, updateData);
    return await this._homePageBannerRepo._update(banner, options);
  }
}
