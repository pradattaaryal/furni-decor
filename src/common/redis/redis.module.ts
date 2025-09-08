import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { DebuggerModule } from '../debugger/debugger.module';
import { DebuggerService } from '../debugger/debugger.service';
import { REDIS_CLIENT_CONNECTION } from './redis.constant';

@Module({
  imports: [ConfigModule, DebuggerModule],
  providers: [
    {
      provide: REDIS_CLIENT_CONNECTION,
      inject: [ConfigService, DebuggerService],
      useFactory: async (
        configService: ConfigService,
        debuggerService: DebuggerService,
      ) => {
        let isConnected = false;
        const client = createClient({
          password: configService.get<string>('helper.redis.password'),
          socket: {
            host: configService.get<string>('helper.redis.host'),
            port: Number(configService.get<number>('helper.redis.port')),
            reconnectStrategy: (retries) => {
              if (retries > 50) {
                debuggerService.error('Redis limit retry connection');
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
        });

        client.on('error', (err) => {
          isConnected = false;
          debuggerService.error('Redis Connect Error');
          debuggerService.error(err);
        });
        const logger = new Logger(RedisModule.name);

        client.on('connect', () => {
          isConnected = true;
          logger.log('Redis is connected successfully');
        });

        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT_CONNECTION],
})
export class RedisModule {}
