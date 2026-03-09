import { Inject, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import { AIGenerateStructuredDataParams, AIGenerateTextParams, IAIProvider } from '@domain/ai/ai.interface';

@Injectable()
export class OpenAIProvider implements IAIProvider {
  constructor(
    @Inject(OpenAI)
    private readonly client: OpenAI
  ) {}

  async generateText(params: AIGenerateTextParams): Promise<string> {
    const { model, systemPrompt, userPrompt, temperature, maxTokens } = params;

    const response = await this.client.responses.create({
      model: model || 'gpt-5-mini',
      temperature,
      max_output_tokens: maxTokens,
      input: [
        { role: 'system', content: systemPrompt || '' },
        { role: 'user', content: userPrompt }
      ]
    });

    const content = response.output_text;
    return content;
  }

  async generateStructuredData(params: AIGenerateStructuredDataParams): Promise<string> {
    const { model, systemPrompt, userPrompt, schema, schemaName, temperature, maxTokens } = params;

    const response = await this.client.responses.create({
      model: model || 'gpt-5-mini',
      temperature,
      max_output_tokens: maxTokens,
      text: {
        format: {
          type: 'json_schema',
          name: schemaName || 'response',
          strict: true,
          schema
        }
      },
      input: [
        { role: 'system', content: systemPrompt || '' },
        { role: 'user', content: userPrompt }
      ]
    });

    const content = response.output_text;
    return content;
  }
}
