import { Inject, Injectable, Logger } from '@nestjs/common';

import { ResourceConversionErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { IAIProvider, AI_PROVIDER_TOKEN } from '@domain/ai/ai.interface';
import { IDeckRepository, DECK_REPOSITORY_TOKEN } from '@domain/deck/deck.repository';
import { IDiaryRepository, DIARY_REPOSITORY_TOKEN } from '@domain/diary/diary.repository';
import { IQuizRepository, QUIZ_REPOSITORY_TOKEN } from '@domain/quiz/quiz.repository';
import { ResourceType } from '@domain/resource/resource.interface';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';

import { createPrompt, isSupportedConversion } from './prompt.factory';
import { ConvertibleSourceType, ConvertibleTargetType } from './types';

export interface ConvertResourceInput {
  sourceResourceId: string;
  targetResourceType: ResourceType;
  userId: number;
}

export interface ConvertResourceOutput {
  type: ResourceType;
  data: any;
}

@Injectable()
export class ConvertResourceUseCase {
  private readonly logger = new Logger(ConvertResourceUseCase.name);

  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository,
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: IDiaryRepository,
    @Inject(QUIZ_REPOSITORY_TOKEN)
    private readonly quizRepository: IQuizRepository,
    @Inject(DECK_REPOSITORY_TOKEN)
    private readonly deckRepository: IDeckRepository,
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: IAIProvider
  ) {}

  async execute(input: ConvertResourceInput): Promise<ConvertResourceOutput> {
    const { sourceResourceId, targetResourceType, userId } = input;

    const sourceResource = await this.resourceRepository.findOne({ id: sourceResourceId, userId });
    if (!sourceResource) {
      throw new Exception(ResourceConversionErrorCodes.SOURCE_NOT_FOUND);
    }

    if (!isSupportedConversion(sourceResource.type, targetResourceType)) {
      throw new Exception(ResourceConversionErrorCodes.INVALID_CONVERSION);
    }

    const sourceType = sourceResource.type as ConvertibleSourceType;
    const targetType = targetResourceType as ConvertibleTargetType;

    const sourceData = await this.loadSourceData(sourceType, sourceResourceId);
    if (!sourceData) {
      throw new Exception(ResourceConversionErrorCodes.SOURCE_NOT_FOUND);
    }

    const { systemPrompt, userPrompt, schema } = createPrompt(sourceType, targetType, sourceData);

    let rawResult: string;

    try {
      rawResult = await this.aiProvider.generateStructuredData({
        systemPrompt,
        userPrompt,
        schema,
        schemaName: `${sourceType}_to_${targetType}`
      });
    } catch (error) {
      this.logger.error(`AI generation failed for conversion ${sourceType}->${targetType}`, error);
      throw new Exception(ResourceConversionErrorCodes.AI_GENERATION_FAILED);
    }

    const data = JSON.parse(rawResult);

    return { type: targetType, data };
  }

  private async loadSourceData(sourceType: ConvertibleSourceType, resourceId: string) {
    switch (sourceType) {
      case ResourceType.DIARY:
        return this.diaryRepository.findOne({ resourceId });

      case ResourceType.QUIZ:
        return this.quizRepository.findOne({ resourceId }, { items: { options: true } });

      case ResourceType.DECK:
        return this.deckRepository.findOne({ resourceId }, { flashcards: true });
    }
  }
}
