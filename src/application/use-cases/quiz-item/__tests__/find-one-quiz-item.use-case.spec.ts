import { Test } from '@nestjs/testing';

import { Exception, QuizItemErrorCodes } from '@application/errors';
import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';
import { QUIZ_ITEM_REPOSITORY_TOKEN } from '@domain/repositories/quiz-item/quiz-item.repository';

import { FindOneQuizItemUseCase } from '../find-one-quiz-item.use-case';

describe('Use Cases -> QuizItem -> Find One', () => {
  let findOneQuizItemUseCase: FindOneQuizItemUseCase;

  const quizItem = new QuizItemMock();

  const quizItemRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneQuizItemUseCase,
        {
          provide: QUIZ_ITEM_REPOSITORY_TOKEN,
          useValue: quizItemRepositoryMock
        }
      ]
    }).compile();

    findOneQuizItemUseCase = module.get<FindOneQuizItemUseCase>(FindOneQuizItemUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one quiz item', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(quizItem);

    const input = {
      filters: { id: quizItem.id },
      relations: { options: true }
    };

    const result = await findOneQuizItemUseCase.execute(input);

    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(quizItem);
  });

  it('should not find quiz item - quiz item not found', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: quizItem.id }
    };

    await expect(findOneQuizItemUseCase.execute(input)).rejects.toThrow(new Exception(QuizItemErrorCodes.NOT_FOUND));
    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
