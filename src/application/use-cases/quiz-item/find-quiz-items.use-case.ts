import { Inject, Injectable } from '@nestjs/common';

import { QuizItemEntity } from '@domain/entities/quiz-item/quiz-item.entity';
import {
  FilterQuizItem,
  IQuizItemRepository,
  QUIZ_ITEM_REPOSITORY_TOKEN,
  RelationsQuizItem
} from '@domain/repositories/quiz-item/quiz-item.repository';

type FindQuizItemsInput = {
  filters?: FilterQuizItem;
  relations?: RelationsQuizItem;
};

type FindQuizItemsOutput = {
  quizItems: QuizItemEntity[];
  total: number;
};

@Injectable()
export class FindQuizItemsUseCase {
  constructor(
    @Inject(QUIZ_ITEM_REPOSITORY_TOKEN)
    private readonly quizItemRepository: IQuizItemRepository
  ) {}

  async execute(input: FindQuizItemsInput = {}): Promise<FindQuizItemsOutput> {
    const { filters, relations } = input;

    const { quizItems, total } = await this.quizItemRepository.find(filters, relations);

    return {
      quizItems: quizItems.map((quizItem) => new QuizItemEntity(quizItem)),
      total
    };
  }
}
