import { Test } from '@nestjs/testing';

import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';
import { QUIZ_ITEM_REPOSITORY_TOKEN } from '@domain/repositories/quiz-item/quiz-item.repository';

import { CreateQuizItemUseCase } from '../create-quiz-item.use-case';

describe('Use Cases -> QuizItem -> Create', () => {
  let createQuizItemUseCase: CreateQuizItemUseCase;

  const quizItem = new QuizItemMock();

  const quizItemRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateQuizItemUseCase,
        {
          provide: QUIZ_ITEM_REPOSITORY_TOKEN,
          useValue: quizItemRepositoryMock
        }
      ]
    }).compile();

    createQuizItemUseCase = module.get<CreateQuizItemUseCase>(CreateQuizItemUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create quiz item', async () => {
    quizItemRepositoryMock.create.mockResolvedValue(quizItem);

    const input = {
      data: {
        quizId: quizItem.quizId,
        question: quizItem.question,
        position: quizItem.position,
        timeLimit: quizItem.timeLimit,
        explanation: quizItem.explanation,
        options: quizItem.options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          position: opt.position
        }))
      }
    };

    const result = await createQuizItemUseCase.execute(input);

    expect(quizItemRepositoryMock.create).toHaveBeenCalledWith(input.data);
    expect(result).toEqual(quizItem);
  });

  it('should create quiz item without optional fields', async () => {
    const quizItemWithoutOptional = { ...quizItem, timeLimit: undefined, explanation: undefined };
    quizItemRepositoryMock.create.mockResolvedValue(quizItemWithoutOptional);

    const input = {
      data: {
        quizId: quizItem.quizId,
        question: quizItem.question,
        position: quizItem.position,
        options: []
      }
    };

    const result = await createQuizItemUseCase.execute(input);

    expect(quizItemRepositoryMock.create).toHaveBeenCalledWith(input.data);
    expect(result).toEqual(quizItemWithoutOptional);
  });
});
