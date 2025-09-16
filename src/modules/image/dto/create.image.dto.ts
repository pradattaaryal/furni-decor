import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  CustomIsEnum,
  CustomIsNotEmpty,
  CustomIsString,
} from 'src/common/request/validators/custom-validator';
import { UPLOAD_FOLDER_ENUM } from '../constants/upload.folder.enum.list';
import { BasePhoto } from './base.file.photo';

export class ImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}

export class ImageUploadDTO {
  @ApiProperty({ type: 'string', enum: UPLOAD_FOLDER_ENUM })
  @CustomIsEnum(UPLOAD_FOLDER_ENUM)
  @CustomIsNotEmpty()
  @CustomIsString()
  folder: UPLOAD_FOLDER_ENUM;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}

export class ImageUploadFolderDTO extends PickType(ImageUploadDTO, ['folder']) {}
export class ImagesUploadDTO extends PickType(ImageUploadDTO, ['folder']) {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'File uploads',
  })
  files: any;
}

export class ImageCreateDto extends PickType(BasePhoto, ['filename', 'path']) {}
