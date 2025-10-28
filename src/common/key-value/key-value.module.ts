import {
  DynamicModule,
  ForwardReference,
  Global,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { KeyValueRedisService } from './services/key-value.redis.service';

@Global()
@Module({})
export class KeyValueModule {
  static forRoot({
    useCache,
    useRedis,
  }: {
    useCache?: boolean;
    useRedis?: boolean;
  }): DynamicModule {
    const providers: Provider<any>[] = [];
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];

    imports.push(ConfigModule);
    if (useCache) {
      // imports.push(CacheModule.register());
      // providers.push(KeyValueCacheService);
    }
    if (useRedis) {
      imports.push(RedisModule);
      providers.push(KeyValueRedisService);
    }

    return {
      module: KeyValueModule,
      providers,
      exports: providers,
      controllers: [],
      imports: [...imports],
    };
  }
}
