import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule as NestCommandModule } from 'nestjs-command';
import configs from 'src/common/configs';
import { DatabaseModule } from 'src/common/database/database.module';
import { SeedCommand } from './seed.command';
import { TriggerCommand } from './trigger.command';
import { TriggerRemoveCommand } from './remove-trigger.command';
import { DebuggerModule } from 'src/common/debugger/debugger.module';

@Module({
  imports: [
    NestCommandModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env'],
    }),
    DebuggerModule,
  ],
  providers: [TriggerCommand, SeedCommand],
  //providers: [SeedCommand, TriggerCommand, TriggerRemoveCommand],
})
export class CommandModule {}
