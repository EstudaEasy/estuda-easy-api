import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { QuizItemModel } from '@database/typeorm/models/quiz-item/quiz-item.model';
import { QuizOptionModel } from '@database/typeorm/models/quiz-option/quiz-option.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';

import { QuizItemRepository } from '../quiz-item.repository';

describe('TypeOrm -> QuizItem Repository -> Delete', () => {
  const quizItemMock = new QuizItemMock();

  let quizItemRepository: QuizItemRepository;
  let quizItemRepositoryMock: Repository<QuizItemModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizItemRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizItemModel),
          useValue: {
            delete: jest.fn()
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

    deleteSpy = jest.spyOn(quizItemRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a quiz item and return true - quiz item found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await quizItemRepository.delete({ id: quizItemMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - quiz item not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await quizItemRepository.delete({ id: quizItemMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
