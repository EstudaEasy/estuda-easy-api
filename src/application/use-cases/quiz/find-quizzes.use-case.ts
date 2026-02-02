import { Inject, Injectable } from '@nestjs/common';

import { QuizEntity } from '@domain/entities/quiz/quiz.entity';
import {
  FilterQuiz,
  IQuizRepository,
  QUIZ_REPOSITORY_TOKEN,
  RelationsQuiz
} from '@domain/repositories/quiz/quiz.repository';

type FindQuizzesInput = {
  filters?: FilterQuiz;
  relations?: RelationsQuiz;
};

type FindQuizzesOutput = {
  quizzes: QuizEntity[];
  total: number;
};

@Injectable()
export class FindQuizzesUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY_TOKEN)
    private readonly quizRepository: IQuizRepository
  ) {}

  async execute(input: FindQuizzesInput = {}): Promise<FindQuizzesOutput> {
    const { filters, relations } = input;

    const { quizzes, total } = await this.quizRepository.find(filters, relations);

    return {
      quizzes: quizzes.map((quiz) => new QuizEntity(quiz)),
      total
    };
  }
}
