import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

import { OpenAIConfig } from '@config/openai/config';
import { OpenAIProvider } from '@providers/openai/openai.provider';

@Module({
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<OpenAIConfig>('openai');
        return new OpenAI({ apiKey: config.apiKey });
      },
      inject: [ConfigService]
    },
    OpenAIProvider
  ],
  exports: [OpenAIProvider]
})
export class OpenAIModule {}
