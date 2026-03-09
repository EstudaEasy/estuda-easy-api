import { Module } from '@nestjs/common';

import { AI_PROVIDER_TOKEN } from '@domain/ai/ai.interface';
import { GeminiProvider } from '@providers/gemini/gemini.provider';

import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  providers: [
    {
      provide: AI_PROVIDER_TOKEN,
      useExisting: GeminiProvider
    }
  ],
  exports: [AI_PROVIDER_TOKEN]
})
export class AIModule {}
