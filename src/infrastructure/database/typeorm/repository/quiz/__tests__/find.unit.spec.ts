import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizModel } from '@database/typeorm/models/quiz/quiz.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';

import { QuizRepository } from '../quiz.repository';

describe('TypeOrm -> Quiz Repository -> Find', () => {
  const quizMocks = QuizMock.getList(3);

  let quizRepository: QuizRepository;
  let quizRepositoryMock: Repository<QuizModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    quizRepository = module.get<QuizRepository>(QuizRepository);
    quizRepositoryMock = module.get<Repository<QuizModel>>(getRepositoryToken(QuizModel));

    findAndCountSpy = jest.spyOn(quizRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return quizzes with count', async () => {
    findAndCountSpy.mockResolvedValue([quizMocks, quizMocks.length]);

    const res = await quizRepository.find();

    expect(res).toEqual({ quizzes: quizMocks, total: 3 });
    expect(res.quizzes).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no quizzes found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await quizRepository.find();

    expect(res).toEqual({ quizzes: [], total: 0 });
    expect(res.quizzes).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
