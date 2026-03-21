import { IDeck } from '@domain/deck/deck.interface';
import { IDiary } from '@domain/diary/diary.interface';
import { IQuiz } from '@domain/quiz/quiz.interface';
import { ResourceType } from '@domain/resource/resource.interface';

import {
  getDeckToQuizPrompt,
  getDeckToTaskPrompt,
  getDiaryToDeckPrompt,
  getDiaryToQuizPrompt,
  getDiaryToTaskPrompt,
  getQuizToDeckPrompt,
  getQuizToQuizPrompt,
  getQuizToTaskPrompt
} from './prompts';
import { ConversionKey, ConversionPrompt, ConvertibleSourceType, ConvertibleTargetType } from './types';

export const SUPPORTED_CONVERSIONS: Set<ConversionKey> = new Set([
  `${ResourceType.DIARY}->${ResourceType.QUIZ}`,
  `${ResourceType.DIARY}->${ResourceType.DECK}`,
  `${ResourceType.DIARY}->${ResourceType.TASK}`,
  `${ResourceType.QUIZ}->${ResourceType.DECK}`,
  `${ResourceType.QUIZ}->${ResourceType.TASK}`,
  `${ResourceType.QUIZ}->${ResourceType.QUIZ}`,
  `${ResourceType.DECK}->${ResourceType.QUIZ}`,
  `${ResourceType.DECK}->${ResourceType.TASK}`
]);

export function isSupportedConversion(sourceType: ResourceType, targetType: ResourceType): boolean {
  const key = `${sourceType}->${targetType}` as ConversionKey;
  return SUPPORTED_CONVERSIONS.has(key);
}

export function createPrompt(
  sourceType: ConvertibleSourceType,
  targetType: ConvertibleTargetType,
  sourceData: IDiary | IQuiz | IDeck
): ConversionPrompt {
  const conversionKey: ConversionKey = `${sourceType}->${targetType}`;

  switch (conversionKey) {
    case `${ResourceType.DIARY}->${ResourceType.QUIZ}`:
      return getDiaryToQuizPrompt(sourceData as IDiary);

    case `${ResourceType.DIARY}->${ResourceType.DECK}`:
      return getDiaryToDeckPrompt(sourceData as IDiary);

    case `${ResourceType.DIARY}->${ResourceType.TASK}`:
      return getDiaryToTaskPrompt(sourceData as IDiary);

    case `${ResourceType.QUIZ}->${ResourceType.DECK}`:
      return getQuizToDeckPrompt(sourceData as IQuiz);

    case `${ResourceType.QUIZ}->${ResourceType.TASK}`:
      return getQuizToTaskPrompt(sourceData as IQuiz);

    case `${ResourceType.QUIZ}->${ResourceType.QUIZ}`:
      return getQuizToQuizPrompt(sourceData as IQuiz);

    case `${ResourceType.DECK}->${ResourceType.QUIZ}`:
      return getDeckToQuizPrompt(sourceData as IDeck);

    case `${ResourceType.DECK}->${ResourceType.TASK}`:
      return getDeckToTaskPrompt(sourceData as IDeck);

    default:
      throw new Error(`Unsupported conversion: ${conversionKey}`);
  }
}
