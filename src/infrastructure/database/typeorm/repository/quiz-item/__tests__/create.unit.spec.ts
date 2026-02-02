import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizItemModel } from '@database/typeorm/models/quiz-item/quiz-item.model';
import { QuizOptionModel } from '@database/typeorm/models/quiz-option/quiz-option.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';
import { QuizOptionMock } from '@domain/entities/quiz-option/__mocks__/quiz-option.mock';

import { QuizItemRepository } from '../quiz-item.repository';

describe('TypeOrm -> QuizItem Repository -> Create', () => {
  const quizItemMock = new QuizItemMock();
  const quizOptionsMock = QuizOptionMock.getList(4);

  let quizItemRepository: QuizItemRepository;
  let itemRepositoryMock: Repository<QuizItemModel>;
  let optionRepositoryMock: Repository<QuizOptionModel>;
  let itemCreateSpy: jest.SpyInstance;
  let itemSaveSpy: jest.SpyInstance;
  let optionCreateSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizItemRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizItemModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(QuizOptionModel),
          useValue: {
            create: jest.fn()
          }
        }
      ]
    }).compile();

    quizItemRepository = module.get<QuizItemRepository>(QuizItemRepository);
    itemRepositoryMock = module.get<Repository<QuizItemModel>>(getRepositoryToken(QuizItemModel));
    optionRepositoryMock = module.get<Repository<QuizOptionModel>>(getRepositoryToken(QuizOptionModel));

    itemCreateSpy = jest.spyOn(itemRepositoryMock, 'create');
    itemSaveSpy = jest.spyOn(itemRepositoryMock, 'save');
    optionCreateSpy = jest.spyOn(optionRepositoryMock, 'create');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a quiz item with options', async () => {
    const quizItemWithOptions = { ...quizItemMock, options: quizOptionsMock };
    itemCreateSpy.mockReturnValue(quizItemWithOptions);
    optionCreateSpy.mockReturnValue(quizOptionsMock);
    itemSaveSpy.mockResolvedValue(quizItemWithOptions);

    const res = await quizItemRepository.create({
      quizId: quizItemMock.quizId,
      question: quizItemMock.question,
      position: quizItemMock.position,
      timeLimit: quizItemMock.timeLimit,
      explanation: quizItemMock.explanation,
      options: quizOptionsMock.map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
        position: opt.position
      }))
    });

    expect(res).toStrictEqual(quizItemWithOptions);
    expect(itemCreateSpy).toHaveBeenCalledTimes(1);
    expect(optionCreateSpy).toHaveBeenCalledTimes(1);
    expect(itemSaveSpy).toHaveBeenCalledTimes(1);
  });

  it('should create quiz item with empty options array', async () => {
    const quizItemWithEmptyOptions = { ...quizItemMock, options: [] };
    itemCreateSpy.mockReturnValue(quizItemWithEmptyOptions);
    itemSaveSpy.mockResolvedValue(quizItemWithEmptyOptions);

    const res = await quizItemRepository.create({
      quizId: quizItemMock.quizId,
      question: quizItemMock.question,
      position: quizItemMock.position,
      options: []
    });

    expect(res).toStrictEqual(quizItemWithEmptyOptions);
    expect(itemCreateSpy).toHaveBeenCalledTimes(1);
    expect(itemSaveSpy).toHaveBeenCalledTimes(1);
    expect(optionCreateSpy).not.toHaveBeenCalled();
  });
});
