import { Global, Module } from '@nestjs/common';
import { DebuggerService } from './debugger.service';
import { LoggerModule } from 'src/common/logger/logger.module';

@Global()
@Module({
  imports: [LoggerModule],
  providers: [DebuggerService],
  exports: [DebuggerService],
})
export class DebuggerModule {}
