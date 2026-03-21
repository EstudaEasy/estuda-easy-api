import { GoogleGenAI } from '@google/genai';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GeminiConfig } from '@config/gemini/config';
import { GeminiProvider } from '@providers/gemini/gemini.provider';

@Module({
  providers: [
    {
      provide: GoogleGenAI,
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<GeminiConfig>('gemini');
        return new GoogleGenAI({ apiKey: config.apiKey });
      },
      inject: [ConfigService]
    },
    GeminiProvider
  ],
  exports: [GeminiProvider]
})
export class GeminiModule {}
