import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { ImageEntity } from '../entities/image.entity';

@Injectable()
export class ImageRepository extends BaseRepository<ImageEntity> {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {
    super(imageRepository);
  }
}
