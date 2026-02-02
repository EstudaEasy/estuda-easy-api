import { Inject, Injectable } from '@nestjs/common';

import { Exception, QuizItemErrorCodes } from '@application/errors';
import {
  FilterQuizItem,
  IQuizItemRepository,
  QUIZ_ITEM_REPOSITORY_TOKEN
} from '@domain/repositories/quiz-item/quiz-item.repository';

type DeleteQuizItemInput = {
  filters: FilterQuizItem;
};

@Injectable()
export class DeleteQuizItemUseCase {
  constructor(
    @Inject(QUIZ_ITEM_REPOSITORY_TOKEN)
    private readonly quizItemRepository: IQuizItemRepository
  ) {}

  async execute(input: DeleteQuizItemInput): Promise<void> {
    const { filters } = input;

    const quizItem = await this.quizItemRepository.findOne(filters);
    if (!quizItem) {
      throw new Exception(QuizItemErrorCodes.NOT_FOUND);
    }

    const deleted = await this.quizItemRepository.delete(filters);
    if (!deleted) {
      throw new Exception(QuizItemErrorCodes.NOT_DELETED);
    }
  }
}
