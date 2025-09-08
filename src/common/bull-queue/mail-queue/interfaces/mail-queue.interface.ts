import * as Brevo from '@getbrevo/brevo';

export interface IMailPayload {
  sendSmtpEmail: Brevo.SendSmtpEmail;
  options?: {
    headers: {
      [name: string]: string;
    };
  };
}
