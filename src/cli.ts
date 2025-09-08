import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { CommandModule as AppCommandModule } from './commands/command.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppCommandModule, {
    logger: ['error'],
  });
  try {
    await app.select(CommandModule).get(CommandService).exec();
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}

bootstrap();
