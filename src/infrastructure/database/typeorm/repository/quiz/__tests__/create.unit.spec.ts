import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizModel } from '@database/typeorm/models/quiz/quiz.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';

import { QuizRepository } from '../quiz.repository';

describe('TypeOrm -> Quiz Repository -> Create', () => {
  const quizMock = new QuizMock();

  let quizRepository: QuizRepository;
  let quizRepositoryMock: Repository<QuizModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(QuizModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    quizRepository = module.get<QuizRepository>(QuizRepository);
    quizRepositoryMock = module.get<Repository<QuizModel>>(getRepositoryToken(QuizModel));

    createSpy = jest.spyOn(quizRepositoryMock, 'create');
    createSpy.mockReturnValue(quizMock);

    saveSpy = jest.spyOn(quizRepositoryMock, 'save');
    saveSpy.mockResolvedValue(quizMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a quiz', async () => {
    const res = await quizRepository.create({
      title: quizMock.title,
      description: quizMock.description
    });

    expect(res).toStrictEqual(quizMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
