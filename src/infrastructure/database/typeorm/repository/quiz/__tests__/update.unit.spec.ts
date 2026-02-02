import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { QuizModel } from '@database/typeorm/models/quiz/quiz.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';

import { QuizRepository } from '../quiz.repository';

describe('TypeOrm -> Quiz Repository -> Update', () => {
  const quizMock = new QuizMock();

  let quizRepository: QuizRepository;
  let quizRepositoryMock: Repository<QuizModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    quizRepository = module.get<QuizRepository>(QuizRepository);
    quizRepositoryMock = module.get<Repository<QuizModel>>(getRepositoryToken(QuizModel));

    updateSpy = jest.spyOn(quizRepositoryMock, 'update');
    findOneSpy = jest.spyOn(quizRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a quiz - quiz updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(quizMock);

    const res = await quizRepository.update({ id: quizMock.id }, { title: 'Updated Title' });

    expect(res).toStrictEqual(quizMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - quiz not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await quizRepository.update({ id: quizMock.id }, { title: 'Updated Title' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
