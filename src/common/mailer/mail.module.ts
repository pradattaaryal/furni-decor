import {
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';
import { IMailerOptions } from './interfaces/mailer.interface';
import { BrevoModule } from './brevo/brevo.module';
import { BrevoService } from './brevo/services/brevo.service';
import { MailProcessor } from './processors/mail-processor';
import { MailerService } from './services/mailer.service';
import { MAILER_TOKEN } from './constants/mailer.constants';

export class MailModule {
  static forRoot(options: IMailerOptions): DynamicModule {
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];
    const providers: Provider<any>[] = [];

    if (options.brevo) {
      imports.push(BrevoModule);
      providers.push({
        provide: MAILER_TOKEN,
        useClass: BrevoService,
      });
    }
    providers.push(MailerService);
    providers.push(MailProcessor);

    return {
      module: MailModule,
      imports: [...imports],
      providers,
      exports: providers,
    };
  }
}
