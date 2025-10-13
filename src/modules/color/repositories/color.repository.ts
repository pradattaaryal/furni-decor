import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { ColorEntity } from '../entities/color.entity';

@Injectable()
export class ColorRepository extends BaseRepository<ColorEntity> {
  constructor(
    @InjectRepository(ColorEntity)
    private repository: Repository<ColorEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<ColorEntity> {
    return this.repository;
  }
}

