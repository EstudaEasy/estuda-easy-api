import { Inject, Injectable } from '@nestjs/common';

import { Exception, QuizItemErrorCodes } from '@application/errors';
import { QuizItemEntity } from '@domain/entities/quiz-item/quiz-item.entity';
import {
  FilterQuizItem,
  IQuizItemRepository,
  QUIZ_ITEM_REPOSITORY_TOKEN,
  RelationsQuizItem
} from '@domain/repositories/quiz-item/quiz-item.repository';

type FindOneQuizItemInput = {
  filters: FilterQuizItem;
  relations?: RelationsQuizItem;
};

@Injectable()
export class FindOneQuizItemUseCase {
  constructor(
    @Inject(QUIZ_ITEM_REPOSITORY_TOKEN)
    private readonly quizItemRepository: IQuizItemRepository
  ) {}

  async execute(input: FindOneQuizItemInput): Promise<QuizItemEntity> {
    const { filters, relations } = input;

    const quizItem = await this.quizItemRepository.findOne(filters, relations);
    if (!quizItem) {
      throw new Exception(QuizItemErrorCodes.NOT_FOUND);
    }

    return new QuizItemEntity(quizItem);
  }
}
