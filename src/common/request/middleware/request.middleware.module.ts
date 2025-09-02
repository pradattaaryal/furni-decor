import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestTimezoneMiddleware } from './timezone/request.timezone.middleware';
import { RequestTimestampMiddleware } from './version/request.timestamp.middleware';

@Module({})
export class RequestMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestTimestampMiddleware, RequestTimezoneMiddleware)
      .forRoutes('*');
  }
}
