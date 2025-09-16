import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from '../constants/app.constant';
import { LOGGER_CLIENT_CONNECTION } from 'src/common/logger/logger.constant';
import pino from 'pino';

@Injectable()
export class DebuggerService {
  env: ENUM_APP_ENVIRONMENT;
  constructor(
    private readonly configService: ConfigService,
    @Inject(LOGGER_CLIENT_CONNECTION)
    private readonly loggerService: pino.Logger,
  ) {
    this.env = this.configService.get<ENUM_APP_ENVIRONMENT>(
      'app.env',
      ENUM_APP_ENVIRONMENT.DEVELOPMENT, //Default value of none is given
    );
  }

  log(...data: any[]) {
    if (this.env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
      console.log(...data);
    }
  }

  info(data: any) {
    console.log('🚀 ~ DebuggerService ~ info ~ data:', data);
    this.loggerService.info(data);
  }

  warn(data: any) {
    console.log('🚀 ~ DebuggerService ~ warn ~ data:', data);
    this.loggerService.warn(data);
  }

  error(error: any | Error) {
    this.loggerService.error(error);
  }
}
