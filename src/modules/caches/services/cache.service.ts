import { Injectable, NotFoundException } from '@nestjs/common';
import { KeyValueRedisService } from 'src/common/key-value/services/key-value.redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly _keyValueService: KeyValueRedisService) {}

  async getAllKeyValues(): Promise<Record<string, string>> {
    const data = {};
    const keysList: string[] = await this._keyValueService.getAllKeys();

    if (keysList.length <= 0) {
      throw new NotFoundException('Keys not found in redis');
    }

    for (let i = 0; i < keysList.length; i++) {
      const valueType = await this._keyValueService.getType(keysList[i]);
      // console.log("Key: ", keysList[i], "Value type: ", valueType)
      if (valueType === 'string') {
        data[keysList[i]] = await this._keyValueService.get(keysList[i]);
      } else if (valueType === 'hash') {
        data[keysList[i]] = await this._keyValueService.hGet(keysList[i]);
      } else if (valueType === 'zset') {
        data[keysList[i]] = await this._keyValueService.zGet(keysList[i]);
      }
    }
    return data;
  }
}
