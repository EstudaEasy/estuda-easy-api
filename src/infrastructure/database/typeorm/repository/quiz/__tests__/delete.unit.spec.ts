import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { QuizModel } from '@database/typeorm/models/quiz/quiz.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';

import { QuizRepository } from '../quiz.repository';

describe('TypeOrm -> Quiz Repository -> Delete', () => {
  const quizMock = new QuizMock();

  let quizRepository: QuizRepository;
  let quizRepositoryMock: Repository<QuizModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    quizRepository = module.get<QuizRepository>(QuizRepository);
    quizRepositoryMock = module.get<Repository<QuizModel>>(getRepositoryToken(QuizModel));

    deleteSpy = jest.spyOn(quizRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a quiz and return true - quiz found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await quizRepository.delete({ id: quizMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - quiz not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await quizRepository.delete({ id: quizMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
