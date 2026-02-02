import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizItemModel } from '@database/typeorm/models/quiz-item/quiz-item.model';
import { QuizOptionModel } from '@database/typeorm/models/quiz-option/quiz-option.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';

import { QuizItemRepository } from '../quiz-item.repository';

describe('TypeOrm -> QuizItem Repository -> Find', () => {
  const quizItemMocks = QuizItemMock.getList(3);

  let quizItemRepository: QuizItemRepository;
  let quizItemRepositoryMock: Repository<QuizItemModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizItemRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizItemModel),
          useValue: {
            findAndCount: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(QuizOptionModel),
          useValue: {}
        }
      ]
    }).compile();

    quizItemRepository = module.get<QuizItemRepository>(QuizItemRepository);
    quizItemRepositoryMock = module.get<Repository<QuizItemModel>>(getRepositoryToken(QuizItemModel));

    findAndCountSpy = jest.spyOn(quizItemRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return quiz items with count', async () => {
    findAndCountSpy.mockResolvedValue([quizItemMocks, quizItemMocks.length]);

    const res = await quizItemRepository.find();

    expect(res).toEqual({ quizItems: quizItemMocks, total: 3 });
    expect(res.quizItems).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no quiz items found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await quizItemRepository.find();

    expect(res).toEqual({ quizItems: [], total: 0 });
    expect(res.quizItems).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
