import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Sends an email.
   * @param email The recipient's email address.
   * @param subject The subject of the email.
   * @param html The HTML content of the email.
   */
  async sendMail(email: string, subject: string, html: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
      this.logger.log(`Email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error.stack);
      // Depending on your app's needs, you might want to throw an exception here
      throw new InternalServerErrorException('Could not send email.');
    }
  }
}