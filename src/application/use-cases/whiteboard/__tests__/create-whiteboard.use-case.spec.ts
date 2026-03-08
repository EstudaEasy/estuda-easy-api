import { Test } from '@nestjs/testing';

import { ResourceMock } from '@domain/resource/__mocks__/resource.mock';
import { ResourceType } from '@domain/resource/resource.interface';
import { RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { UserMock } from '@domain/user/__mocks__/user.mock';
import { WhiteboardMock } from '@domain/whiteboard/__mocks__/whiteboard.mock';
import { WHITEBOARD_REPOSITORY_TOKEN } from '@domain/whiteboard/whiteboard.repository';

import { CreateWhiteboardUseCase } from '../create-whiteboard.use-case';

describe('Use Cases -> Whiteboard -> Create', () => {
  let createWhiteboardUseCase: CreateWhiteboardUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ type: ResourceType.WHITEBOARD, userId: user.id });
  const whiteboard = new WhiteboardMock({ resourceId: resource.id });

  const resourceRepositoryMock = {
    create: jest.fn()
  };

  const whiteboardRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateWhiteboardUseCase,
        {
          provide: RESOURCE_REPOSITORY_TOKEN,
          useValue: resourceRepositoryMock
        },
        {
          provide: WHITEBOARD_REPOSITORY_TOKEN,
          useValue: whiteboardRepositoryMock
        }
      ]
    }).compile();

    createWhiteboardUseCase = module.get<CreateWhiteboardUseCase>(CreateWhiteboardUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create whiteboard with resource', async () => {
    resourceRepositoryMock.create.mockResolvedValue(resource);
    whiteboardRepositoryMock.create.mockResolvedValue(whiteboard);

    const input = {
      data: {
        title: whiteboard.title,
        content: whiteboard.content
      },
      userId: user.id
    };

    const result = await createWhiteboardUseCase.execute(input);

    expect(resourceRepositoryMock.create).toHaveBeenCalledWith({
      type: ResourceType.WHITEBOARD,
      userId: user.id
    });
    expect(whiteboardRepositoryMock.create).toHaveBeenCalledWith({
      ...input.data,
      resource
    });
    expect(result).toEqual(whiteboard);
  });
});
