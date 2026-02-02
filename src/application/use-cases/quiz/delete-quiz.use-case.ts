import { Inject, Injectable } from '@nestjs/common';

import { Exception, QuizErrorCodes } from '@application/errors';
import { FilterQuiz, IQuizRepository, QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';

type DeleteQuizInput = {
  filters: FilterQuiz;
};

@Injectable()
export class DeleteQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY_TOKEN)
    private readonly quizRepository: IQuizRepository
  ) {}

  async execute(input: DeleteQuizInput): Promise<void> {
    const { filters } = input;

    const quiz = await this.quizRepository.findOne(filters);
    if (!quiz) {
      throw new Exception(QuizErrorCodes.NOT_FOUND);
    }

    const deleted = await this.quizRepository.delete(filters);
    if (!deleted) {
      throw new Exception(QuizErrorCodes.NOT_DELETED);
    }
  }
}
