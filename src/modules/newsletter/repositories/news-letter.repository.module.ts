import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterRepository } from './news-letter.repository';
import { NewsletterEntity } from '../entities/news-letter.entity';

@Module({
  providers: [NewsletterRepository],
  exports: [NewsletterRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([NewsletterEntity])],
})
export class NewsletterRepositoryModule {}
