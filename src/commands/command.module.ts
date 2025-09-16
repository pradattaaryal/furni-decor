import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule as NestCommandModule } from 'nestjs-command';
import configs from 'src/common/configs';
import { DatabaseModule } from 'src/common/database/database.module';
import { SeedCommand } from './seed.command';
import { TriggerCommand } from './trigger.command';
import { TriggerRemoveCommand } from './remove-trigger.command';

@Module({
  imports: [
    NestCommandModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env'],
    }),
  ],
  providers: [SeedCommand, TriggerCommand, TriggerRemoveCommand],
})
export class CommandModule {}
