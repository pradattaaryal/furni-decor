import { PartialType } from '@nestjs/swagger';
import { HomePageBannerCreateDto } from './home-page-banner.create.dto';
import { IHomePageBannerUpdateDto } from '../interfaces/home-page-banner.update.dto.interface';

export class HomePageBannerUpdateDto
  extends PartialType(HomePageBannerCreateDto)
  implements IHomePageBannerUpdateDto {}
