import * as Brevo from '@getbrevo/brevo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractMailerService } from '../../abstract/mailer.abstract.service';
@Injectable()
export class BrevoService extends AbstractMailerService {
  private readonly _brevoApiKey: string;
  private readonly _brevoInstance: Brevo.TransactionalEmailsApi;

  constructor(private readonly _configService: ConfigService) {
    super();
    this._brevoApiKey = this._configService.get<string>(
      'mail.brevo.apiKey',
      '',
    );
    this._brevoInstance = new Brevo.TransactionalEmailsApi();
    this._brevoInstance.setApiKey(0, this._brevoApiKey);
  }

  async sendEmail(
    sendSmtpEmail: Brevo.SendSmtpEmail,
    options?: {
      headers: {
        [name: string]: string;
      };
    },
  ) {
    const result = await this._brevoInstance.sendTransacEmail(
      sendSmtpEmail,
      options,
    );
    return result;
  }
}
