import { Test } from '@nestjs/testing';

import { Exception, QuizErrorCodes } from '@application/errors';
import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';
import { QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';

import { FindOneQuizUseCase } from '../find-one-quiz.use-case';

describe('Use Cases -> Quiz -> Find One', () => {
  let findOneQuizUseCase: FindOneQuizUseCase;

  const quiz = new QuizMock();

  const quizRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneQuizUseCase,
        {
          provide: QUIZ_REPOSITORY_TOKEN,
          useValue: quizRepositoryMock
        }
      ]
    }).compile();

    findOneQuizUseCase = module.get<FindOneQuizUseCase>(FindOneQuizUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one quiz', async () => {
    quizRepositoryMock.findOne.mockResolvedValue(quiz);

    const input = {
      filters: { id: quiz.id },
      relations: { items: true }
    };

    const result = await findOneQuizUseCase.execute(input);

    expect(quizRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(quiz);
  });

  it('should not find quiz - quiz not found', async () => {
    quizRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: quiz.id }
    };

    await expect(findOneQuizUseCase.execute(input)).rejects.toThrow(new Exception(QuizErrorCodes.NOT_FOUND));
    expect(quizRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
