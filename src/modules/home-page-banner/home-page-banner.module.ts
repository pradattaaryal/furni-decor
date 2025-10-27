import { Module } from '@nestjs/common';
import { HomePageBannerService } from './services/home-page-banner.service';
import { HomePageBannerRepositoryModule } from './repositories/home-page-banner.repository.module';
import { HomePageBannerAdminController } from './controllers/home-page-banner.admin.controller';
import { HomePageBannerEntity } from './entities/home-page-banner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [HomePageBannerService],
  exports: [HomePageBannerService],
  imports: [
    HomePageBannerRepositoryModule,
    TypeOrmModule.forFeature([HomePageBannerEntity]),
  ],
})
export class HomePageBannerModule {}
