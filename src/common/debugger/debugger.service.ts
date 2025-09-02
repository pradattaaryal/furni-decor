import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from '../constants/app.constant';
//import { SentryService } from '../sentry/sentry.service';

@Injectable()
export class DebuggerService {
  env: ENUM_APP_ENVIRONMENT;
  constructor(
    private readonly configService: ConfigService,
   // private readonly sentryService: SentryService,
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
    //this.sentryService.captureMessage(data, 'info');
  }

  warn(data: any) {
    console.log('🚀 ~ DebuggerService ~ warn ~ data:', data);
   // this.sentryService.captureMessage(data, 'warning');
  }

  error(error: any | Error) {
    console.log('🚀 ~ DebuggerService ~ error ~ error:', error);
    //this.sentryService.captureException(error);
  }
}
