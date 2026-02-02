import { Inject, Injectable } from '@nestjs/common';

import { Exception, QuizErrorCodes } from '@application/errors';
import { QuizEntity } from '@domain/entities/quiz/quiz.entity';
import {
  FilterQuiz,
  IQuizRepository,
  QUIZ_REPOSITORY_TOKEN,
  UpdateQuiz
} from '@domain/repositories/quiz/quiz.repository';

type UpdateQuizInput = {
  filters: FilterQuiz;
  data: UpdateQuiz;
};

@Injectable()
export class UpdateQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY_TOKEN)
    private readonly quizRepository: IQuizRepository
  ) {}

  async execute(input: UpdateQuizInput): Promise<QuizEntity> {
    const { filters, data } = input;

    const existingQuiz = await this.quizRepository.findOne(filters);
    if (!existingQuiz) {
      throw new Exception(QuizErrorCodes.NOT_FOUND);
    }

    const updatedQuiz = await this.quizRepository.update(filters, data);
    if (!updatedQuiz) {
      throw new Exception(QuizErrorCodes.NOT_UPDATED);
    }

    return new QuizEntity(updatedQuiz);
  }
}
