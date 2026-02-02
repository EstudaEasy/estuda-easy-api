import { Inject, Injectable } from '@nestjs/common';

import { QuizEntity } from '@domain/entities/quiz/quiz.entity';
import { CreateQuiz, IQuizRepository, QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';

export interface CreateQuizInput {
  data: CreateQuiz;
}

@Injectable()
export class CreateQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY_TOKEN)
    private readonly quizRepository: IQuizRepository
  ) {}

  async execute(input: CreateQuizInput): Promise<QuizEntity> {
    const { data } = input;

    const quiz = await this.quizRepository.create(data);

    return new QuizEntity(quiz);
  }
}
