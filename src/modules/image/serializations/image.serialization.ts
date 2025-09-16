import { ApiProperty } from '@nestjs/swagger';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';
import { ImageEntity } from '../entities/image.entity';

export class ImageSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: ImageEntity,
  })
  data: ImageEntity;
}

export class ImagePaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [ImageEntity],
  })
  data: ImageEntity;
}
