import { Inject, Injectable } from '@nestjs/common';

import { Exception, QuizItemErrorCodes } from '@application/errors';
import { QuizItemEntity } from '@domain/entities/quiz-item/quiz-item.entity';
import {
  FilterQuizItem,
  IQuizItemRepository,
  QUIZ_ITEM_REPOSITORY_TOKEN,
  UpdateQuizItem
} from '@domain/repositories/quiz-item/quiz-item.repository';

type UpdateQuizItemInput = {
  filters: FilterQuizItem;
  data: UpdateQuizItem;
};

@Injectable()
export class UpdateQuizItemUseCase {
  constructor(
    @Inject(QUIZ_ITEM_REPOSITORY_TOKEN)
    private readonly quizItemRepository: IQuizItemRepository
  ) {}

  async execute(input: UpdateQuizItemInput): Promise<QuizItemEntity> {
    const { filters, data } = input;

    const existingQuizItem = await this.quizItemRepository.findOne(filters);
    if (!existingQuizItem) {
      throw new Exception(QuizItemErrorCodes.NOT_FOUND);
    }

    const updatedQuizItem = await this.quizItemRepository.update(filters, data);
    if (!updatedQuizItem) {
      throw new Exception(QuizItemErrorCodes.NOT_UPDATED);
    }

    return new QuizItemEntity(updatedQuizItem);
  }
}
