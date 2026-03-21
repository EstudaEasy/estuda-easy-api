import { Injectable, Logger } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

import mailerTemplates from './templates';

@Injectable()
export class MailerProvider {
  private readonly logger = new Logger(MailerProvider.name);
  public readonly templates = mailerTemplates;

  constructor(private readonly mailerService: MailerService) {}

  async send(options: ISendMailOptions) {
    try {
      return await this.mailerService.sendMail(options);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
    }
  }
}
