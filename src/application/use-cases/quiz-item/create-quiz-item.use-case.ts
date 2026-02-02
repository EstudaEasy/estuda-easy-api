import { Inject, Injectable } from '@nestjs/common';

import { QuizItemEntity } from '@domain/entities/quiz-item/quiz-item.entity';
import {
  CreateQuizItem,
  IQuizItemRepository,
  QUIZ_ITEM_REPOSITORY_TOKEN
} from '@domain/repositories/quiz-item/quiz-item.repository';

export interface CreateQuizItemInput {
  data: CreateQuizItem;
}

@Injectable()
export class CreateQuizItemUseCase {
  constructor(
    @Inject(QUIZ_ITEM_REPOSITORY_TOKEN)
    private readonly quizItemRepository: IQuizItemRepository
  ) {}

  async execute(input: CreateQuizItemInput): Promise<QuizItemEntity> {
    const { data } = input;

    const quizItem = await this.quizItemRepository.create(data);

    return new QuizItemEntity(quizItem);
  }
}
