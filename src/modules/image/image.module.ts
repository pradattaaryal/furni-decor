import { Module } from '@nestjs/common';
import { ImageService } from './services/image.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageRepositoryModule } from './repositories/image.repository.module';

@Module({
  imports: [ImageRepositoryModule],
  controllers: [],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
