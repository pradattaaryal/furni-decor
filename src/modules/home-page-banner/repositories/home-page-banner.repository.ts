import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { HomePageBannerEntity } from '../entities/home-page-banner.entity';

@Injectable()
export class HomePageBannerRepository extends BaseRepository<HomePageBannerEntity> {
  constructor(
    @InjectRepository(HomePageBannerEntity)
    private repository: Repository<HomePageBannerEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<HomePageBannerEntity> {
    return this.repository;
  }
}
