import { Inject, Injectable } from '@nestjs/common';

import { QuizEntity } from '@domain/entities/quiz/quiz.entity';
import { ResourceType } from '@domain/entities/resource/resource.interface';
import { CreateQuiz, IQuizRepository, QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/repositories/resource/resource.repository';

export interface CreateQuizInput {
  data: CreateQuiz;
  userId: number;
}

@Injectable()
export class CreateQuizUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository,
    @Inject(QUIZ_REPOSITORY_TOKEN)
    private readonly quizRepository: IQuizRepository
  ) {}

  async execute(input: CreateQuizInput): Promise<QuizEntity> {
    const { data, userId } = input;

    const resource = await this.resourceRepository.create({
      type: ResourceType.QUIZ,
      userId
    });

    const quiz = await this.quizRepository.create({
      ...data,
      resource
    });

    return new QuizEntity(quiz);
  }
}
