import { Test } from '@nestjs/testing';

import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';
import { QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';

import { FindQuizzesUseCase } from '../find-quizzes.use-case';

describe('Use Cases -> Quiz -> Find', () => {
  let findQuizzesUseCase: FindQuizzesUseCase;

  const quizzes = QuizMock.getList(2);
  const total = quizzes.length;

  const quizRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindQuizzesUseCase,
        {
          provide: QUIZ_REPOSITORY_TOKEN,
          useValue: quizRepositoryMock
        }
      ]
    }).compile();

    findQuizzesUseCase = module.get<FindQuizzesUseCase>(FindQuizzesUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find quizzes', async () => {
    quizRepositoryMock.find.mockResolvedValue({ quizzes, total });

    const input = {
      filters: {},
      relations: { items: true }
    };

    const result = await findQuizzesUseCase.execute(input);

    expect(quizRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.quizzes).toEqual(quizzes);
    expect(result.total).toBe(total);
  });

  it('should find quizzes with filters', async () => {
    const filteredQuizzes = [quizzes[0]];
    quizRepositoryMock.find.mockResolvedValue({ quizzes: filteredQuizzes, total: 1 });

    const input = {
      filters: { title: quizzes[0].title },
      relations: { items: true }
    };

    const result = await findQuizzesUseCase.execute(input);

    expect(quizRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.quizzes).toEqual(filteredQuizzes);
    expect(result.total).toBe(1);
  });
});
