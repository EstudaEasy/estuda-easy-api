import { Test } from '@nestjs/testing';

import { Exception, QuizErrorCodes } from '@application/errors';
import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';
import { QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';

import { UpdateQuizUseCase } from '../update-quiz.use-case';

describe('Use Cases -> Quiz -> Update', () => {
  let updateQuizUseCase: UpdateQuizUseCase;

  const quiz = new QuizMock();

  const quizRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateQuizUseCase,
        {
          provide: QUIZ_REPOSITORY_TOKEN,
          useValue: quizRepositoryMock
        }
      ]
    }).compile();

    updateQuizUseCase = module.get<UpdateQuizUseCase>(UpdateQuizUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update quiz', async () => {
    quizRepositoryMock.findOne.mockResolvedValue(quiz);
    quizRepositoryMock.update.mockResolvedValue(quiz);

    const input = {
      filters: { id: quiz.id },
      data: {
        title: 'Updated Title',
        description: 'Updated Description'
      }
    };

    const result = await updateQuizUseCase.execute(input);

    expect(quizRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(quiz);
  });

  it('should not update - quiz not found', async () => {
    quizRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: quiz.id },
      data: { title: 'Updated Title' }
    };

    await expect(updateQuizUseCase.execute(input)).rejects.toThrow(new Exception(QuizErrorCodes.NOT_FOUND));
    expect(quizRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - update failed', async () => {
    quizRepositoryMock.findOne.mockResolvedValue(quiz);
    quizRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: quiz.id },
      data: { title: 'Updated Title' }
    };

    await expect(updateQuizUseCase.execute(input)).rejects.toThrow(new Exception(QuizErrorCodes.NOT_UPDATED));
    expect(quizRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
  });
});
