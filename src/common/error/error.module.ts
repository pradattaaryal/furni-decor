import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './filters/error.filter';
//import { SentryModule } from '../sentry/sentry.module';

@Module({
  imports: [/*SentryModule*/],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class ErrorModule {}
