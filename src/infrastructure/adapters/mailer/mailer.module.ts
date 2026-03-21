import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';

import { MailerConfig } from '@config/mailer/config';
import { MailerProvider } from '@providers/mailer/mailer.provider';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.getOrThrow<MailerConfig>('mailer');
      }
    })
  ],
  providers: [MailerProvider],
  exports: [MailerProvider]
})
export class MailerModule {}
