import { Inject, Injectable } from '@nestjs/common';

import { Exception, QuizErrorCodes } from '@application/errors';
import { QuizEntity } from '@domain/entities/quiz/quiz.entity';
import {
  FilterQuiz,
  IQuizRepository,
  QUIZ_REPOSITORY_TOKEN,
  RelationsQuiz
} from '@domain/repositories/quiz/quiz.repository';

type FindOneQuizInput = {
  filters: FilterQuiz;
  relations?: RelationsQuiz;
};

@Injectable()
export class FindOneQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY_TOKEN)
    private readonly quizRepository: IQuizRepository
  ) {}

  async execute(input: FindOneQuizInput): Promise<QuizEntity> {
    const { filters, relations } = input;

    const quiz = await this.quizRepository.findOne(filters, relations);
    if (!quiz) {
      throw new Exception(QuizErrorCodes.NOT_FOUND);
    }

    return new QuizEntity(quiz);
  }
}
