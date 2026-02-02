import { Test } from '@nestjs/testing';

import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';
import { QUIZ_ITEM_REPOSITORY_TOKEN } from '@domain/repositories/quiz-item/quiz-item.repository';

import { FindQuizItemsUseCase } from '../find-quiz-items.use-case';

describe('Use Cases -> QuizItem -> Find', () => {
  let findQuizItemsUseCase: FindQuizItemsUseCase;

  const quizItems = QuizItemMock.getList(2);
  const total = quizItems.length;

  const quizItemRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindQuizItemsUseCase,
        {
          provide: QUIZ_ITEM_REPOSITORY_TOKEN,
          useValue: quizItemRepositoryMock
        }
      ]
    }).compile();

    findQuizItemsUseCase = module.get<FindQuizItemsUseCase>(FindQuizItemsUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find quiz items', async () => {
    quizItemRepositoryMock.find.mockResolvedValue({ quizItems, total });

    const result = await findQuizItemsUseCase.execute();

    expect(quizItemRepositoryMock.find).toHaveBeenCalledWith(undefined, undefined);
    expect(result.quizItems).toEqual(quizItems);
    expect(result.total).toBe(total);
  });

  it('should find quiz items with filters', async () => {
    const filteredQuizItems = [quizItems[0]];
    quizItemRepositoryMock.find.mockResolvedValue({ quizItems: filteredQuizItems, total: 1 });

    const input = {
      filters: { question: quizItems[0].question }
    };

    const result = await findQuizItemsUseCase.execute(input);

    expect(quizItemRepositoryMock.find).toHaveBeenCalledWith(input.filters, undefined);
    expect(result.quizItems).toEqual(filteredQuizItems);
    expect(result.total).toBe(1);
  });
});
