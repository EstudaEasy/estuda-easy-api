import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizItemModel } from '@database/typeorm/models/quiz-item/quiz-item.model';
import { QuizOptionModel } from '@database/typeorm/models/quiz-option/quiz-option.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';

import { QuizItemRepository } from '../quiz-item.repository';

describe('TypeOrm -> QuizItem Repository -> Find One', () => {
  const quizItemMock = new QuizItemMock();

  let quizItemRepository: QuizItemRepository;
  let quizItemRepositoryMock: Repository<QuizItemModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizItemRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizItemModel),
          useValue: {
            findOne: jest.fn()
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

    findOneSpy = jest.spyOn(quizItemRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(quizItemMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a quiz item - quiz item found', async () => {
    const res = await quizItemRepository.findOne({ id: quizItemMock.id });

    expect(res).toStrictEqual(quizItemMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - quiz item not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await quizItemRepository.findOne({ id: quizItemMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
