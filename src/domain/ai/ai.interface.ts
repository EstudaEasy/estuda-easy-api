export const AI_PROVIDER_TOKEN = 'AI_PROVIDER_TOKEN';

export interface AIGenerateTextParams {
  model?: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIGenerateStructuredDataParams {
  model?: string;
  systemPrompt?: string;
  userPrompt: string;
  schema: Record<string, unknown>;
  schemaName?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface IAIProvider {
  generateText(params: AIGenerateTextParams): Promise<string>;
  generateStructuredData(params: AIGenerateStructuredDataParams): Promise<string>;
}
