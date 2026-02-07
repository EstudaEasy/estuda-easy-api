import { Test } from '@nestjs/testing';

import { QuizMock } from '@domain/entities/quiz/__mocks__/quiz.mock';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';
import { ResourceType } from '@domain/entities/resource/resource.interface';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { QUIZ_REPOSITORY_TOKEN } from '@domain/repositories/quiz/quiz.repository';
import { RESOURCE_REPOSITORY_TOKEN } from '@domain/repositories/resource/resource.repository';

import { CreateQuizUseCase } from '../create-quiz.use-case';

describe('Use Cases -> Quiz -> Create', () => {
  let createQuizUseCase: CreateQuizUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ type: ResourceType.QUIZ, userId: user.id });
  const quiz = new QuizMock({ resourceId: resource.id });

  const resourceRepositoryMock = {
    create: jest.fn()
  };

  const quizRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateQuizUseCase,
        {
          provide: RESOURCE_REPOSITORY_TOKEN,
          useValue: resourceRepositoryMock
        },
        {
          provide: QUIZ_REPOSITORY_TOKEN,
          useValue: quizRepositoryMock
        }
      ]
    }).compile();

    createQuizUseCase = module.get<CreateQuizUseCase>(CreateQuizUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create quiz with resource', async () => {
    resourceRepositoryMock.create.mockResolvedValue(resource);
    quizRepositoryMock.create.mockResolvedValue(quiz);

    const input = {
      data: {
        title: quiz.title,
        description: quiz.description
      },
      userId: user.id
    };

    const result = await createQuizUseCase.execute(input);

    expect(resourceRepositoryMock.create).toHaveBeenCalledWith({
      type: ResourceType.QUIZ,
      userId: user.id
    });
    expect(quizRepositoryMock.create).toHaveBeenCalledWith({
      ...input.data,
      resource
    });
    expect(result).toEqual(quiz);
  });
});
