import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import swaggerInit from './swagger';
import { json, raw, urlencoded } from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    rawBody: true,
    // logger: false, // disables all logs
  });
  app.useStaticAssets(join(__dirname, '..', 'images'), { prefix: '/backend/' });
  app.use(
    '/backend/api/admin/payment/stripe-weebhook',
    raw({
      type: 'application/json',
      verify: (req, res, buf) => {
        (req as any).rawBody = buf;
      },
    }),
  );

  app.use(json());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await swaggerInit(app);
  app.use(helmet());
  const configService = app.get(ConfigService);
  const allowHeaders: string[] = configService.get<string[]>(
    'request.cors.allowHeader',
    [],
  );
  const allowMethod: string[] = configService.get<string[]>(
    'request.cors.allowMethod',
    [],
  );
  // app.getHttpAdapter().getInstance().set('trust proxy', true);
  app.enableCors({
    allowedHeaders: allowHeaders,
    methods: allowMethod,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port: number = configService.get<number>('app.http.port', 3001);
  const host: string = configService.get<string>('app.http.host', 'localhost');
  app.enableShutdownHooks();
  await app.listen(port, host);
}
bootstrap();
