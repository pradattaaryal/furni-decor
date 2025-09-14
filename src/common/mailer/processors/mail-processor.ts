import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import {
  MAIL_JOB,
  MAIL_JOB_NAMES,
} from 'src/common/bull-queue/mail-queue/constants/mail-queue.constant';
import { IMailPayload } from 'src/common/bull-queue/mail-queue/interfaces/mail-queue.interface';
import { DebuggerService } from 'src/common/debugger/debugger.service';
import { AbstractMailProcessor } from '../abstract/mailer.abstract.processor.service';
import { MailerService } from '../services/mailer.service';

@Injectable()
@Processor(MAIL_JOB)
export class MailProcessor extends AbstractMailProcessor {
  constructor(
    private readonly _mailerService: MailerService,
    private readonly _debuggerService: DebuggerService,
  ) {
    super();
  }

  @Process(MAIL_JOB_NAMES.SEND)
  async handleSendMail(sendMailJob: Job<IMailPayload>) {
    try {
      const { sendSmtpEmail, options } = sendMailJob.data;
      await this._mailerService.sendEmail(sendSmtpEmail, options);
    } catch (error) {
      this._debuggerService.error(error);
      throw error;
    }
  }
}
