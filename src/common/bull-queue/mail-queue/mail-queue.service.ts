import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { DebuggerService } from 'src/common/debugger/debugger.service';
import { MAIL_JOB_NAMES, MAIL_JOB } from './constants/mail-queue.constant';
import { IMailPayload } from './interfaces/mail-queue.interface';

@Injectable()
export class MailQueueService {
  constructor(
    @InjectQueue(MAIL_JOB) private readonly _mailQueue: Queue,
    private readonly _debuggerService: DebuggerService,
  ) {}

  sendMail(mailPayload: IMailPayload) {
    //Since we are also using external service so no need to configure much
    this._mailQueue
      .add(MAIL_JOB_NAMES.SEND, mailPayload, {
        removeOnComplete: true,
        removeOnFail: {
          age: 24 * 3600, //24 hrs
        },
        attempts: 3,
        priority: 2,
        timeout: 1 * 60 * 1000,
        backoff: { type: 'fixed', delay: 5 * 60 * 1000 },
      })
      .catch((error) => {
        this._debuggerService.error(error);
      });
  }

  sendTicketMail() {}
}
