import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { NewsletterEntity } from '../entities/news-letter.entity';
 
@Injectable()
export class NewsletterRepository extends BaseRepository<NewsletterEntity> {
  constructor(
    @InjectRepository(NewsletterEntity)
    private repository: Repository<NewsletterEntity>,
  ) {
    super(repository);
  }

  getRepo(): Repository<NewsletterEntity> {
    return this.repository;
  }
}
