import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT_CONNECTION } from 'src/common/redis/redis.constant';
import { IHashValueRedisService } from '../interfaces/hash-value.redis.interface';

//This is Global Service
@Injectable()
export class HashValueRedisService implements IHashValueRedisService {
  constructor(
    @Inject(REDIS_CLIENT_CONNECTION) private readonly redis: RedisClientType,
  ) {}

  async hGet(key: string, field: string): Promise<string | null> {
    return (await this.redis.hGet(key, field)) || null;
  }

  async hSet(
    key: string,
    fields: Record<string, string | number>,
    ttl?: number | null,
  ): Promise<number> {
    const result = await this.redis.hSet(key, fields);
    if (ttl) {
      await this.redis.expire(key, ttl);
    }

    return result;
  }

  async hmGet(key: string, fields: string[]): Promise<(string | null)[]> {
    const results = await this.redis.hmGet(key, fields);
    return results.map((result) => result || null);
  }
  async hIncrBy(
    key: string,
    field: string,
    increment: number,
  ): Promise<number> {
    return await this.redis.hIncrBy(key, field, increment);
  }

  async hDecrBy(
    key: string,
    field: string,
    decrement: number,
  ): Promise<number> {
    return await this.redis.hIncrBy(key, field, -decrement);
  }

  async hDel(key: string, fields: string[]): Promise<number> {
    return await this.redis.hDel(key, fields);
  }

  async deleteHash(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async hGetAll(key: string): Promise<Record<string, any>> {
    return await this.redis.hGetAll(key);
  }
}
