import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomePageBannerEntity } from '../entities/home-page-banner.entity';
import { HomePageBannerRepository } from './home-page-banner.repository';

@Module({
  providers: [HomePageBannerRepository],
  exports: [HomePageBannerRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([HomePageBannerEntity])],
})
export class HomePageBannerRepositoryModule {}
