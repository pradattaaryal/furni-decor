import { Global, Module } from '@nestjs/common';
import { DebuggerService } from './debugger.service';
//import { SentryModule } from '../sentry/sentry.module';

@Global()
@Module({
  providers: [DebuggerService],
  exports: [DebuggerService],
  imports: [/*SentryModule*/],
})
export class DebuggerModule {}
