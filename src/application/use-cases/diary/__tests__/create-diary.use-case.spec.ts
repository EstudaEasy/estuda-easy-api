import { Test } from '@nestjs/testing';

import { DiaryMock } from '@domain/diary/__mocks__/diary.mock';
import { DIARY_REPOSITORY_TOKEN } from '@domain/diary/diary.repository';
import { ResourceMock } from '@domain/resource/__mocks__/resource.mock';
import { ResourceType } from '@domain/resource/resource.interface';
import { RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { UserMock } from '@domain/user/__mocks__/user.mock';

import { CreateDiaryUseCase } from '../create-diary.use-case';

describe('Use Cases -> Diary -> Create', () => {
  let createDiaryUseCase: CreateDiaryUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ type: ResourceType.DIARY, userId: user.id });
  const diary = new DiaryMock({ resourceId: resource.id });

  const resourceRepositoryMock = {
    create: jest.fn()
  };

  const diaryRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateDiaryUseCase,
        {
          provide: RESOURCE_REPOSITORY_TOKEN,
          useValue: resourceRepositoryMock
        },
        {
          provide: DIARY_REPOSITORY_TOKEN,
          useValue: diaryRepositoryMock
        }
      ]
    }).compile();

    createDiaryUseCase = module.get<CreateDiaryUseCase>(CreateDiaryUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create diary with resource', async () => {
    resourceRepositoryMock.create.mockResolvedValue(resource);
    diaryRepositoryMock.create.mockResolvedValue(diary);

    const input = {
      data: {
        title: diary.title,
        content: diary.content,
        audioUrl: diary.audioUrl
      },
      userId: user.id
    };

    const result = await createDiaryUseCase.execute(input);

    expect(resourceRepositoryMock.create).toHaveBeenCalledWith({
      type: ResourceType.DIARY,
      userId: user.id
    });
    expect(diaryRepositoryMock.create).toHaveBeenCalledWith({
      ...input.data,
      resource
    });
    expect(result).toEqual(diary);
  });
});
