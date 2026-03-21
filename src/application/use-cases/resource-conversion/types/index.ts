import { ResourceType } from '@domain/resource/resource.interface';

export type ConversionPrompt = {
  systemPrompt: string;
  userPrompt: string;
  schema: Record<string, unknown>;
};

export type ConvertibleSourceType = ResourceType.DIARY | ResourceType.QUIZ | ResourceType.DECK;
export type ConvertibleTargetType = ResourceType.QUIZ | ResourceType.DECK | ResourceType.TASK;
export type ConversionKey = `${ConvertibleSourceType}->${ConvertibleTargetType}`;
