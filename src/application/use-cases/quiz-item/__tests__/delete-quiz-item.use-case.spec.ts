import { Test } from '@nestjs/testing';

import { Exception, QuizItemErrorCodes } from '@application/errors';
import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';
import { QUIZ_ITEM_REPOSITORY_TOKEN } from '@domain/repositories/quiz-item/quiz-item.repository';

import { DeleteQuizItemUseCase } from '../delete-quiz-item.use-case';

describe('Use Cases -> QuizItem -> Delete', () => {
  let deleteQuizItemUseCase: DeleteQuizItemUseCase;

  const quizItem = new QuizItemMock();

  const quizItemRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteQuizItemUseCase,
        {
          provide: QUIZ_ITEM_REPOSITORY_TOKEN,
          useValue: quizItemRepositoryMock
        }
      ]
    }).compile();

    deleteQuizItemUseCase = module.get<DeleteQuizItemUseCase>(DeleteQuizItemUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete quiz item', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(quizItem);
    quizItemRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: quizItem.id }
    };

    await expect(deleteQuizItemUseCase.execute(input)).resolves.toBeUndefined();

    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizItemRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should not delete - quiz item not found', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: quizItem.id }
    };

    await expect(deleteQuizItemUseCase.execute(input)).rejects.toThrow(new Exception(QuizItemErrorCodes.NOT_FOUND));
    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizItemRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - failed to delete', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(quizItem);
    quizItemRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: quizItem.id }
    };

    await expect(deleteQuizItemUseCase.execute(input)).rejects.toThrow(new Exception(QuizItemErrorCodes.NOT_DELETED));
    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizItemRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });
});
