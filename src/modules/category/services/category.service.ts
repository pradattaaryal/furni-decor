import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { DeepPartial, ILike, Not, UpdateResult, SelectQueryBuilder } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryCreateDto } from '../dto/create-category.dto';
import { ICategoryUpdateDto } from '../interfaces/category.update.dto.interface';

@Injectable()
export class CategoryService {
  constructor(private readonly _categoryRepo: CategoryRepository) {}

  async create(
    createDto: CategoryCreateDto,
    options?: ICreateOptions,
  ): Promise<CategoryEntity> {
    const data = await this._categoryRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<CategoryEntity>,
  ): Promise<CategoryEntity | null> {
    const data = await this._categoryRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<CategoryEntity>,
  ): Promise<CategoryEntity | null> {
    const data = await this._categoryRepo._findOne(options);
    return data;
  }

  async getOneOrFail(
    options: IFindOneOptions<CategoryEntity>,
  ): Promise<CategoryEntity> {
    const data = await this.getOne(options);
    if (!data) {
      throw new NotFoundException('Cannot find Category');
    }
    return data;
  }

  async getAll(
    options?: IFindAllOptions<CategoryEntity>,
  ): Promise<CategoryEntity[]> {
    return await this._categoryRepo._findAll(options);
  }

  getQueryBuilder(
    name: string
  ): SelectQueryBuilder<CategoryEntity> {
    return this._categoryRepo.getRepo().createQueryBuilder(name);
  }

  async paginatedGet(options?: IPaginateFindOption<CategoryEntity>): Promise<{
    data: CategoryEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._categoryRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: CategoryEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._categoryRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    category: CategoryEntity,
    options?: IUpdateOptions<CategoryEntity>,
  ): Promise<CategoryEntity> {
    return await this._categoryRepo._softDelete(category, options);
  }

  async delete(
    category: CategoryEntity,
    options?: IDeleteOptions<CategoryEntity>,
  ): Promise<CategoryEntity> {
    return await this._categoryRepo._delete(category, options);
  }

  async restore(
    options: IUpdateRawOptions<CategoryEntity>,
  ): Promise<UpdateResult | null> {
    return await this._categoryRepo._restoreRaw(options);
  }

  async update(
    category: CategoryEntity,
    updateData: ICategoryUpdateDto,
    options?: IUpdateOptions<CategoryEntity>,
  ) {
    return await this._categoryRepo._update(category, options);
  }

  // Custom methods for category-specific functionality
  async fetchCategoryByName(slug: string): Promise<CategoryEntity[]> {
    return this._categoryRepo.fetchCategoryByName(slug);
  }

  async fetchCategory(id: number): Promise<CategoryEntity | null> {
    return this._categoryRepo.fetchCategory(id);
  }

  async updateCategory(id: number, data: Partial<CategoryEntity>): Promise<CategoryEntity | null> {
    return this._categoryRepo.updateCategory(id, data);
  }
}
