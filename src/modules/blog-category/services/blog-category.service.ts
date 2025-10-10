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
import { BlogCategoryCreateDto } from '../dto/blog-category.create.dto';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { IBlogCategoryUpdateDto } from '../interfaces/blog-category.update.dto.interface';
import { BlogCategoryRepository } from '../repositories/blog-category.repository';

@Injectable()
export class BlogCategoryService {
  constructor(private readonly _blogCategoryRepo: BlogCategoryRepository) {}

  async create(
    createDto: BlogCategoryCreateDto,
    options?: ICreateOptions,
  ): Promise<BlogCategoryEntity> {
    const data = await this._blogCategoryRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<BlogCategoryEntity>,
  ): Promise<BlogCategoryEntity | null> {
    const data = await this._blogCategoryRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<BlogCategoryEntity>,
  ): Promise<BlogCategoryEntity | null> {
    const data = await this._blogCategoryRepo._findOne(options);
    return data;
  }

  async getOneOrFail(
    options: IFindOneOptions<BlogCategoryEntity>,
  ): Promise<BlogCategoryEntity> {
    const data = await this.getOne(options);
    if (!data) {
      throw new NotFoundException('Cannot find Blog Category');
    }
    return data;
  }

  async getAll(
    options?: IFindAllOptions<BlogCategoryEntity>,
  ): Promise<BlogCategoryEntity[]> {
    return await this._blogCategoryRepo._findAll(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<BlogCategoryEntity> {
    return this._blogCategoryRepo.getRepo().createQueryBuilder(name);
  }

  async paginatedGet(
    options?: IPaginateFindOption<BlogCategoryEntity>,
  ): Promise<{
    data: BlogCategoryEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._blogCategoryRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: BlogCategoryEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._blogCategoryRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    blogCategory: BlogCategoryEntity,
    options?: IUpdateOptions<BlogCategoryEntity>,
  ): Promise<BlogCategoryEntity> {
    return await this._blogCategoryRepo._softDelete(blogCategory, options);
  }

  async delete(
    blogCategory: BlogCategoryEntity,
    options?: IDeleteOptions<BlogCategoryEntity>,
  ): Promise<BlogCategoryEntity> {
    return await this._blogCategoryRepo._delete(blogCategory, options);
  }

  async restore(
    options: IUpdateRawOptions<BlogCategoryEntity>,
  ): Promise<UpdateResult | null> {
    return await this._blogCategoryRepo._restoreRaw(options);
  }

  async update(
    blogCategory: BlogCategoryEntity,
    updateData: IBlogCategoryUpdateDto,
    options?: IUpdateOptions<BlogCategoryEntity>,
  ) {
    return await this._blogCategoryRepo._update(blogCategory, options);
  }
}
