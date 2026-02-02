import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizItemModel } from '@database/typeorm/models/quiz-item/quiz-item.model';
import { QuizOptionModel } from '@database/typeorm/models/quiz-option/quiz-option.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';
import { QuizOptionMock } from '@domain/entities/quiz-option/__mocks__/quiz-option.mock';

import { QuizItemRepository } from '../quiz-item.repository';

describe('TypeOrm -> QuizItem Repository -> Update', () => {
  const quizItemMock = new QuizItemMock();
  const quizOptionsMock = QuizOptionMock.getList(4);

  let quizItemRepository: QuizItemRepository;
  let itemRepositoryMock: Repository<QuizItemModel>;
  let optionRepositoryMock: Repository<QuizOptionModel>;
  let itemFindOneSpy: jest.SpyInstance;
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
            findOne: jest.fn(),
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

    itemFindOneSpy = jest.spyOn(itemRepositoryMock, 'findOne');
    itemCreateSpy = jest.spyOn(itemRepositoryMock, 'create');
    itemSaveSpy = jest.spyOn(itemRepositoryMock, 'save');
    optionCreateSpy = jest.spyOn(optionRepositoryMock, 'create');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a quiz item without updating options', async () => {
    const existingQuizItem = { ...quizItemMock, options: quizOptionsMock };
    const updatedQuizItem = { ...existingQuizItem, question: 'Updated Question' };

    itemFindOneSpy.mockResolvedValue(existingQuizItem);
    itemCreateSpy.mockReturnValue(updatedQuizItem);
    itemSaveSpy.mockResolvedValue(updatedQuizItem);

    const res = await quizItemRepository.update({ id: quizItemMock.id }, { question: 'Updated Question' });

    expect(res).toStrictEqual(updatedQuizItem);
    expect(itemFindOneSpy).toHaveBeenCalledTimes(1);
    expect(itemCreateSpy).toHaveBeenCalledTimes(1);
    expect(itemSaveSpy).toHaveBeenCalledTimes(1);
    expect(optionCreateSpy).not.toHaveBeenCalled();
  });

  it('should update and return a quiz item with new options', async () => {
    const existingQuizItem = { ...quizItemMock, options: quizOptionsMock };
    const newOptions = QuizOptionMock.getList(2);
    const updatedQuizItem = { ...existingQuizItem, options: newOptions };

    itemFindOneSpy.mockResolvedValue(existingQuizItem);
    itemCreateSpy.mockReturnValue(updatedQuizItem);
    optionCreateSpy.mockReturnValue(newOptions);
    itemSaveSpy.mockResolvedValue(updatedQuizItem);

    const res = await quizItemRepository.update(
      { id: quizItemMock.id },
      {
        question: 'Updated Question',
        options: newOptions.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          position: opt.position
        }))
      }
    );

    expect(res).toStrictEqual(updatedQuizItem);
    expect(itemFindOneSpy).toHaveBeenCalledTimes(1);
    expect(itemCreateSpy).toHaveBeenCalledTimes(1);
    expect(optionCreateSpy).toHaveBeenCalledTimes(1);
    expect(itemSaveSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null when quiz item is not found', async () => {
    itemFindOneSpy.mockResolvedValue(null);

    const res = await quizItemRepository.update({ id: quizItemMock.id }, { question: 'Updated Question' });

    expect(res).toBeNull();
    expect(itemFindOneSpy).toHaveBeenCalledTimes(1);
    expect(itemCreateSpy).not.toHaveBeenCalled();
    expect(itemSaveSpy).not.toHaveBeenCalled();
    expect(optionCreateSpy).not.toHaveBeenCalled();
  });

  it('should update multiple fields at once', async () => {
    const existingQuizItem = { ...quizItemMock, options: quizOptionsMock };
    const updatedQuizItem = {
      ...existingQuizItem,
      question: 'New Question',
      position: 5,
      timeLimit: 60,
      explanation: 'New explanation'
    };

    itemFindOneSpy.mockResolvedValue(existingQuizItem);
    itemCreateSpy.mockReturnValue(updatedQuizItem);
    itemSaveSpy.mockResolvedValue(updatedQuizItem);

    const res = await quizItemRepository.update(
      { id: quizItemMock.id },
      {
        question: 'New Question',
        position: 5,
        timeLimit: 60,
        explanation: 'New explanation'
      }
    );

    expect(res).toStrictEqual(updatedQuizItem);
    expect(itemFindOneSpy).toHaveBeenCalledTimes(1);
    expect(itemCreateSpy).toHaveBeenCalledTimes(1);
    expect(itemSaveSpy).toHaveBeenCalledTimes(1);
  });
});
