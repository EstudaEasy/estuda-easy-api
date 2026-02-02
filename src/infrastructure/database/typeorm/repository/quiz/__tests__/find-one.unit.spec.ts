import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizModel } from '@database/typeorm/models/quiz/quiz.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';

import { QuizRepository } from '../quiz.repository';

describe('TypeOrm -> Quiz Repository -> Find One', () => {
  const quizMock = new QuizMock();

  let quizRepository: QuizRepository;
  let quizRepositoryMock: Repository<QuizModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    quizRepository = module.get<QuizRepository>(QuizRepository);
    quizRepositoryMock = module.get<Repository<QuizModel>>(getRepositoryToken(QuizModel));

    findOneSpy = jest.spyOn(quizRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(quizMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a quiz - quiz found', async () => {
    const res = await quizRepository.findOne({ id: quizMock.id });

    expect(res).toStrictEqual(quizMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - quiz not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await quizRepository.findOne({ id: quizMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
