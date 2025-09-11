import { Inject, Injectable } from '@nestjs/common';
import { AbstractMailerService } from '../abstract/mailer.abstract.service';
import { MAILER_TOKEN } from '../constants/mailer.constants';

@Injectable()
export class MailerService {
  constructor(
    @Inject(MAILER_TOKEN)
    private readonly _mailerService: AbstractMailerService,
  ) {}

  async sendEmail(data: any, options?: any) {
    await this._mailerService.sendEmail(data, options);
  }
}
