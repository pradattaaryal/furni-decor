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
import { CategoryRepository } from 'src/modules/category/repositories/category.repository';
 
@Injectable()
export class BlogService {
  constructor(private readonly _blogRepo: BlogRepository, private readonly _categoryRepo: CategoryRepository) { }

  async create(
    createDto: ICreateBlogDto,
    options?: ICreateOptions,
  ): Promise<BlogEntity> {

   
    if (createDto.categoryId === undefined) {
      throw new Error('Category ID is required');
    }
    const blog = await this._blogRepo._findOneById(createDto.categoryId);

    const data = await this._blogRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<BlogEntity>,
  ): Promise<BlogEntity | null> {
    const data = await this._blogRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<BlogEntity>,
  ): Promise<BlogEntity | null> {
    const data = await this._blogRepo._findOne(options);
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
    return await this._blogRepo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<BlogEntity>): Promise<{
    data: BlogEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._blogRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: BlogEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this._blogRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    blog: BlogEntity,
    options?: IUpdateOptions<BlogEntity>,
  ): Promise<BlogEntity> {
    return await this._blogRepo._softDelete(blog, options);
  }

  async delete(
    blog: BlogEntity,
    options?: IDeleteOptions<BlogEntity>,
  ): Promise<BlogEntity> {
    return await this._blogRepo._delete(blog, options);
  }

  async restore(
    options: IUpdateRawOptions<BlogEntity>,
  ): Promise<UpdateResult | null> {
    return await this._blogRepo._restoreRaw(options);
  }

  async update(
    blog: BlogEntity,
    updateData: IBlogUpdateDto,
    options?: IUpdateOptions<BlogEntity>,
  ) {

    if (updateData.categoryId === undefined) {
      throw new Error('Category ID is required');
    }
    const category = await this._blogRepo._findOneById(updateData.categoryId);

    if (!category) {
      throw new Error(`Category of id ${updateData.categoryId} not found`);
    }


    return await this._blogRepo._update(blog, options);
  }
}
