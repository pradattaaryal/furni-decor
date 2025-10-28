import { Module } from '@nestjs/common';
import { KeyValueModule } from 'src/common/key-value/key-value.module';
import { CacheService } from './services/cache.service';

@Module({
  imports: [KeyValueModule.forRoot({ useRedis: true })],
  controllers: [],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
