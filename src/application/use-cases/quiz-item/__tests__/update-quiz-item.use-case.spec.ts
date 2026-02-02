import { Test } from '@nestjs/testing';

import { Exception, QuizItemErrorCodes } from '@application/errors';
import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';
import { QUIZ_ITEM_REPOSITORY_TOKEN } from '@domain/repositories/quiz-item/quiz-item.repository';

import { UpdateQuizItemUseCase } from '../update-quiz-item.use-case';

describe('Use Cases -> QuizItem -> Update', () => {
  let updateQuizItemUseCase: UpdateQuizItemUseCase;

  const quizItem = new QuizItemMock();

  const quizItemRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateQuizItemUseCase,
        {
          provide: QUIZ_ITEM_REPOSITORY_TOKEN,
          useValue: quizItemRepositoryMock
        }
      ]
    }).compile();

    updateQuizItemUseCase = module.get<UpdateQuizItemUseCase>(UpdateQuizItemUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update quiz item', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(quizItem);
    quizItemRepositoryMock.update.mockResolvedValue(quizItem);

    const input = {
      filters: { id: quizItem.id },
      data: {
        question: 'Updated Question',
        position: 2
      }
    };

    const result = await updateQuizItemUseCase.execute(input);

    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizItemRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(quizItem);
  });

  it('should update quiz item with options', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(quizItem);
    quizItemRepositoryMock.update.mockResolvedValue(quizItem);

    const input = {
      filters: { id: quizItem.id },
      data: {
        question: 'Updated Question',
        options: [
          { text: 'Option 1', isCorrect: true, position: 1 },
          { text: 'Option 2', isCorrect: false, position: 2 }
        ]
      }
    };

    const result = await updateQuizItemUseCase.execute(input);

    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizItemRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(quizItem);
  });

  it('should not update - quiz item not found', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: quizItem.id },
      data: { question: 'Updated Question' }
    };

    await expect(updateQuizItemUseCase.execute(input)).rejects.toThrow(new Exception(QuizItemErrorCodes.NOT_FOUND));
    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizItemRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - update failed', async () => {
    quizItemRepositoryMock.findOne.mockResolvedValue(quizItem);
    quizItemRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: quizItem.id },
      data: { question: 'Updated Question' }
    };

    await expect(updateQuizItemUseCase.execute(input)).rejects.toThrow(new Exception(QuizItemErrorCodes.NOT_UPDATED));
    expect(quizItemRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizItemRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
  });
});
