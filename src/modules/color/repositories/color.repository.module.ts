import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from '../entities/color.entity';
import { ColorRepository } from './color.repository';

@Module({
  providers: [ColorRepository],
  exports: [ColorRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([ColorEntity])],
})
export class ColorRepositoryModule {}

