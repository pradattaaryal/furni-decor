import { Controller, Get } from '@nestjs/common';
import { CacheService } from '../services/cache.service';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { ApiDocs } from 'src/common/doc/common-docs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cache')
@Controller('cache')
export class CacheAdminController {
  constructor(private readonly _cacheService: CacheService) {}

  @ApiDocs({
    operation: 'Get all keys and values from redis',
    jwtAccessToken: true,
  })
  @Get('list-all')
  @ResponseMessage('All keys and values fetched')
  async getAllKeyValues(): Promise<IResponse<Record<string, string>>> {
    const data = await this._cacheService.getAllKeyValues();

    return { data };
  }
}
