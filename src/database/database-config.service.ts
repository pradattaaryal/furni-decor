import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DebuggerService } from 'src/common/debugger/debugger.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private configService: ConfigService,
    private debuggerService: DebuggerService,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('database.type', { infer: true }),
      url:
        this.configService.get<string>('database.url', { infer: true }) ||
        undefined,
      host: this.configService.get<string>('database.host', { infer: true }),
      port: this.configService.get<string>('database.port', { infer: true }),
      username: this.configService.get<string>('database.username', {
        infer: true,
      }),
      password: this.configService.get<string>('database.password', {
        infer: true,
      }),
      database: this.configService.get<string>('database.name', {
        infer: true,
      }),
      synchronize: this.configService.get<string>('database.synchronize', {
        infer: true,
      }),
      cache: {
        type: 'redis',
        options: {
          password: this.configService.get<string>('helper.redis.password'),
          socket: {
            host: this.configService.get<string>('helper.redis.host'),
            port: Number(this.configService.get<number>('helper.redis.port')),
            reconnectStrategy: (retries) => {
              if (retries > 50) {
                this.debuggerService.error('Redis limit retry connection');
                throw new Error('Redis limit retry connection');
              } else if (retries > 25) {
                return 30 * 1000;
              }
              if (retries > 10) {
                return 15 * 1000;
              }
              return 10 * 100;
            },
          },
        },
        ignoreErrors: true,
      },
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('DATABASE_LOGGING', {
          infer: true,
        }) === 'true',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get(
                'database.rejectUnauthorized', //If this is true then ca,key and cert is required
                { infer: true },
              ),
              ca:
                this.configService.get('database.ca', { infer: true }) ??
                undefined,
              key:
                this.configService.get('database.key', { infer: true }) ??
                undefined,
              cert:
                this.configService.get('database.cert', { infer: true }) ??
                undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
