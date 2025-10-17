import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { DebuggerService } from 'src/common/debugger/debugger.service';
import { ImageTypes } from 'src/common/file/constants/file.constant';
import { IFile } from 'src/common/file/interfaces/file.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { DeepPartial, EntityManager, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FILE_ASSOCIATION_TYPE } from '../constants/association-type.enum';
import { ImageUploadDTO, ImagesUploadDTO } from '../dto/create.image.dto';
import { ImageEntity } from '../entities/image.entity';
import { ImageRepository } from '../repositories/image.repository';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { UPLOAD_FOLDER_ENUM } from '../constants/upload.folder.enum.list';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepo: ImageRepository,
    private readonly debuggerService: DebuggerService,
  ) {}

  async create(
    createDto: DeepPartial<ImageEntity>,
    options?: ICreateOptions,
  ): Promise<ImageEntity> {
    const data = await this.imageRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ImageEntity>,
  ): Promise<ImageEntity | null> {
    const data = await this.imageRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<ImageEntity>,
  ): Promise<ImageEntity | null> {
    const data = await this.imageRepo._findOne(options);
    return data;
  }

  async getOneOrFail(
    options: IFindOneOptions<ImageEntity>,
  ): Promise<ImageEntity> {
    const data: ImageEntity | null = await this.imageRepo._findOne(options);
    if (!data) {
      throw new NotFoundException('File Not Found');
    }
    return data;
  }

  async getAll(options?: IFindAllOptions<ImageEntity>): Promise<ImageEntity[]> {
    return await this.imageRepo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<ImageEntity>): Promise<{
    data: ImageEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.imageRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: ImageEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.imageRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: ImageEntity,
    options?: IUpdateOptions<ImageEntity>,
  ): Promise<ImageEntity> {
    return await this.imageRepo._softDelete(repo, options);
  }

  async delete(
    repo: ImageEntity,
    options?: IDeleteOptions<ImageEntity>,
  ): Promise<ImageEntity> {
    return await this.imageRepo._delete(repo, options);
  }

  async restore(
    options: IUpdateRawOptions<ImageEntity>,
  ): Promise<UpdateResult> {
    return await this.imageRepo._restoreRaw(options);
  }

  async update(
    repo: ImageEntity,
    updateData: QueryDeepPartialEntity<ImageEntity>,
    options?: IUpdateOptions<ImageEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.imageRepo._update(repo, options);
  }
  async save(repo: ImageEntity, options?: IUpdateOptions<ImageEntity>) {
    return await this.imageRepo._update(repo, options);
  }

  async checkFileNotImages(ids: number[]) {
    const allFiles = await this.imageRepo._findAll({
      options: {
        where: {
          id: In(ids),
        },
      },
    });

    for (const id of ids) {
      const foundFile = allFiles.find((f) => f.id === id);
      if (!foundFile) {
        throw new NotFoundException('File not found');
      }
      if (ImageTypes.includes(foundFile.mime.toLowerCase())) {
        throw new BadRequestException('Images not allowed.');
      }
    }
  }

  async addFile(
    body: ImageUploadDTO | ImagesUploadDTO,
    file: IFile,
    entityManager: EntityManager,
    __user?: string | null,
  ) {
    try {
      const size: number = file.size;

      const filename: string = file.originalname;

      const content: Buffer = file.buffer;

      const newFilename = this.random(20);

      const mime: string = filename
        .substring(filename.lastIndexOf('.') + 1, filename.length)
        .toUpperCase();

      const newFileNameWithMime = `${newFilename}.${mime}`;
      const imageAssocType = this.getImageType(body.folder);

      const result: ImageEntity = await this.create(
        {
          path: `images/${body.folder}`,
          filename: newFilename,
          mime: mime,
          size: size,
          type: imageAssocType,
        },
        {
          entityManager,
        },
      );

      await fs.writeFile(
        `images/${body.folder}/${newFileNameWithMime}`,
        content,
      );

      return result;
    } catch (error) {
      this.debuggerService.error(error);
      throw error;
    }
  }

  async softDeleteAll(
    id: number,
    type: FILE_ASSOCIATION_TYPE,
    entityManager?: EntityManager,
  ) {
    await this.imageRepo._softDeleteRaw({
      entityManager,
      where: { id, type },
    });
  }

  private random(length: number = 10): string {
    return crypto.randomBytes(length).toString('hex');
  }

  private getImageType(folder: UPLOAD_FOLDER_ENUM): string {
    let type: string;
    switch (folder) {
      case UPLOAD_FOLDER_ENUM.PRODUCT_VARIANT:
        type = FILE_ASSOCIATION_TYPE.PRODUCT_VARIANT;
        break;
      case UPLOAD_FOLDER_ENUM.USER:
        type = FILE_ASSOCIATION_TYPE.USER;
        break;
         case UPLOAD_FOLDER_ENUM.PRODUCT_IMAGE:
        type = FILE_ASSOCIATION_TYPE.PRODUCT_IMAGE;
        break;
    }
    return type;
  }
}
