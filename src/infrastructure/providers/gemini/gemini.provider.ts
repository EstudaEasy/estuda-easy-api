import { GoogleGenAI } from '@google/genai';
import { Inject, Injectable } from '@nestjs/common';

import { AIGenerateStructuredDataParams, AIGenerateTextParams, IAIProvider } from '@domain/ai/ai.interface';

@Injectable()
export class GeminiProvider implements IAIProvider {
  constructor(
    @Inject(GoogleGenAI)
    private readonly client: GoogleGenAI
  ) {}

  async generateText(params: AIGenerateTextParams): Promise<string> {
    const { model, systemPrompt, userPrompt, temperature, maxTokens } = params;

    const response = await this.client.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature,
        maxOutputTokens: maxTokens
      }
    });

    return response.text || '';
  }

  async generateStructuredData(params: AIGenerateStructuredDataParams): Promise<string> {
    const { model, systemPrompt, userPrompt, schema, temperature, maxTokens } = params;

    const response = await this.client.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    return response.text || '';
  }
}
