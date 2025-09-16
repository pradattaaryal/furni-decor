import { Module } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from '../entities/image.entity';

@Module({
  providers: [ImageRepository],
  exports: [ImageRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([ImageEntity])],
})
export class ImageRepositoryModule {}
