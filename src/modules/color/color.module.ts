import { Module } from '@nestjs/common';
import { ColorService } from './services/color.service';
import { ColorRepositoryModule } from './repositories/color.repository.module';
import { ColorAdminController } from './controllers/color.admin.controller';
import { ColorEntity } from './entities/color.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ColorService],
  exports: [ColorService],
  controllers: [],
  imports: [ColorRepositoryModule, TypeOrmModule.forFeature([ColorEntity])],
})
export class ColorModule {}
