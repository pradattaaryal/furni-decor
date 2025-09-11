export abstract class AbstractMailerService {
  abstract sendEmail(data: any, options?: any): Promise<any>;
}
