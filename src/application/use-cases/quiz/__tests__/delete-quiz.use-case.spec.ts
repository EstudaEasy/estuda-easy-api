import { Test } from '@nestjs/testing';

import { Exception, QuizErrorCodes } from '@application/errors';
import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';
import { QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';

import { DeleteQuizUseCase } from '../delete-quiz.use-case';

describe('Use Cases -> Quiz -> Delete', () => {
  let deleteQuizUseCase: DeleteQuizUseCase;

  const quiz = new QuizMock();

  const quizRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteQuizUseCase,
        {
          provide: QUIZ_REPOSITORY_TOKEN,
          useValue: quizRepositoryMock
        }
      ]
    }).compile();

    deleteQuizUseCase = module.get<DeleteQuizUseCase>(DeleteQuizUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete quiz', async () => {
    quizRepositoryMock.findOne.mockResolvedValue(quiz);
    quizRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: quiz.id }
    };

    await expect(deleteQuizUseCase.execute(input)).resolves.toBeUndefined();

    expect(quizRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should not delete - quiz not found', async () => {
    quizRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: quiz.id }
    };

    await expect(deleteQuizUseCase.execute(input)).rejects.toThrow(new Exception(QuizErrorCodes.NOT_FOUND));
    expect(quizRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - failed to delete', async () => {
    quizRepositoryMock.findOne.mockResolvedValue(quiz);
    quizRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: quiz.id }
    };

    await expect(deleteQuizUseCase.execute(input)).rejects.toThrow(new Exception(QuizErrorCodes.NOT_DELETED));
    expect(quizRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(quizRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });
});
