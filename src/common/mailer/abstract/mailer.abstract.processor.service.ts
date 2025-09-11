import { Job } from 'bull';

export abstract class AbstractMailProcessor {
  abstract handleSendMail(job: Job<any>): Promise<any>;
}
