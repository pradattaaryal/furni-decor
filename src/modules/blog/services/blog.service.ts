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
import { BlogRepository } from '../repositories/blog.repository';
import { BlogEntity } from '../entities/blog.entity';
import { IBlogUpdateDto } from '../interfaces/blog.update.dto.interface';
import { ICreateBlogDto } from '../interfaces/blog.create.dto.interface';

@Injectable()
export class BlogService {
  constructor(private readonly _categoryRepo: BlogRepository) {}

  async create(
    createDto: ICreateBlogDto,
    options?: ICreateOptions,
  ): Promise<BlogEntity> {
    const data = await this._categoryRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<BlogEntity>,
  ): Promise<BlogEntity | null> {
    const data = await this._categoryRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<BlogEntity>,
  ): Promise<BlogEntity | null> {
    const data = await this._categoryRepo._findOne(options);
    return data;
  }

  async getOneOrFail(
    options: IFindOneOptions<BlogEntity>,
  ): Promise<BlogEntity> {
    const data = await this.getOne(options);
    if (!data) {
      throw new NotFoundException('Cannot find Blog');
    }
    return data;
  }

  async getAll(options?: IFindAllOptions<BlogEntity>): Promise<BlogEntity[]> {
    return await this._categoryRepo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<BlogEntity>): Promise<{
    data: BlogEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._categoryRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: BlogEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._categoryRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    category: BlogEntity,
    options?: IUpdateOptions<BlogEntity>,
  ): Promise<BlogEntity> {
    return await this._categoryRepo._softDelete(category, options);
  }

  async delete(
    category: BlogEntity,
    options?: IDeleteOptions<BlogEntity>,
  ): Promise<BlogEntity> {
    return await this._categoryRepo._delete(category, options);
  }

  async restore(
    options: IUpdateRawOptions<BlogEntity>,
  ): Promise<UpdateResult | null> {
    return await this._categoryRepo._restoreRaw(options);
  }

  async update(
    category: BlogEntity,
    updateData: IBlogUpdateDto,
    options?: IUpdateOptions<BlogEntity>,
  ) {
    return await this._categoryRepo._update(category, options);
  }
}
