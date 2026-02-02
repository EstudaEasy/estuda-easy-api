import { Test } from '@nestjs/testing';

import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';
import { QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';

import { CreateQuizUseCase } from '../create-quiz.use-case';

describe('Use Cases -> Quiz -> Create', () => {
  let createQuizUseCase: CreateQuizUseCase;

  const quiz = new QuizMock();

  const quizRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateQuizUseCase,
        {
          provide: QUIZ_REPOSITORY_TOKEN,
          useValue: quizRepositoryMock
        }
      ]
    }).compile();

    createQuizUseCase = module.get<CreateQuizUseCase>(CreateQuizUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create quiz', async () => {
    quizRepositoryMock.create.mockResolvedValue(quiz);

    const input = {
      data: {
        title: quiz.title,
        description: quiz.description
      }
    };

    const result = await createQuizUseCase.execute(input);

    expect(quizRepositoryMock.create).toHaveBeenCalledWith(input.data);
    expect(result).toEqual(quiz);
  });
});
