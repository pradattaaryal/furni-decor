import {
  DynamicModule,
  ForwardReference,
  Global,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { IHashValueOptions } from './interfaces/hash-value.options.interface';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { HashValueRedisService } from './services/hash-value.redis.service';

@Global()
@Module({})
export class HashValueModule {
  static forRoot(options: IHashValueOptions): DynamicModule {
    const providers: Provider<any>[] = [];
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];
    imports.push(ConfigModule);
    //Since this is dynamic module adjust your configuration
    if (options.useRedis) {
      imports.push(RedisModule);
      providers.push(HashValueRedisService);
    }
    return {
      module: HashValueModule,
      providers,
      exports: providers,
      controllers: [],
      imports: [...imports],
    };
  }
}
