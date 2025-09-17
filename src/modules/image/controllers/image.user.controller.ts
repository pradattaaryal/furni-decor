import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  SerializeOptions,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import { ApiTags } from '@nestjs/swagger';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ApiDocs } from 'src/common/doc/common-docs';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/interfaces/doc.interface';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import {
  UploadFileMultiple,
  UploadFileSingle,
} from 'src/common/file/decorators/file.decorator';
import { FileRequiredPipe } from 'src/common/file/pipes/file.required.pipe';
import { FileSizeImagePipe } from 'src/common/file/pipes/file.size.pipe';
import { FileTypeImagePipe } from 'src/common/file/pipes/file.type.pipe';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { DataSource, QueryRunner } from 'typeorm';
import { ImagesUploadDTO, ImageUploadDTO } from '../dto/create.image.dto';
import { ImageService } from '../services/image.service';
// import { CustomResponseDecorator } from 'src/common/auth/decorators/custom.response.decorators';
import { ImageSerialization } from '../serializations/image.serialization';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ImageEntity } from '../entities/image.entity';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('Image Upload')
@Controller('image')
export class ImageUserController {
  constructor(
    private readonly _imageService: ImageService,
    private connection: DataSource,
  ) {}

  @ApiDocs({
    bodyType: ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA,
    operation: 'Upload image',
  })
  @UploadFileSingle('file')
  @ResponseMessage('Image uploaded successfully')
  @Post('upload')
  async upload(
    @Body() body: ImageUploadDTO,
    @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
    file: IFile,
  ): Promise<any> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this._imageService.addFile(
        body,
        file,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return { data: result };
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    } finally {
      await queryRunner.release();
    }
  }

  @ApiDocs({
    bodyType: ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA,
    operation: 'Upload multiple image',
    description: 'Max file count is 20',
  })
  @UploadFileMultiple('files')
  @ResponseMessage('Images uploaded successfully')
  @HttpCode(HttpStatus.OK)
  @Post('uploads')
  async uploadArray(
    @Body() body: ImagesUploadDTO,
    @UploadedFiles(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
    files: IFile[],
  ): Promise<any> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await Promise.all(
        files.map((file) =>
          this._imageService.addFile(body, file, queryRunner.manager),
        ),
      );

      await queryRunner.commitTransaction();

      return { data: result };
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    } finally {
      await queryRunner.release();
    }
  }

  @ApiDocs({
    operation: 'Get File by id',
    params: [
      {
        name: 'id',
        required: true,
        type: 'number',
      },
    ],
    serialization: ImageSerialization,
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Image detail fetched')
  @Get('/info/:id')
  async getImageById(@Param('id') id: number): Promise<IResponse<ImageEntity>> {
    const file = await this._imageService.getById(id);
    if (!file) {
      throw new NotFoundException('Cannot file file');
    }
    return { data: file };
  }
}
