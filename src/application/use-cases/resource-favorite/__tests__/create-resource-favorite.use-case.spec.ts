import { Test } from '@nestjs/testing';

import { ResourceErrorCodes, ResourceFavoriteErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { ResourceMock } from '@domain/resource/__mocks__/resource.mock';
import { RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';
import { RESOURCE_FAVORITE_REPOSITORY_TOKEN } from '@domain/resource-favorite/resource-favorite.repository';

import { CreateResourceFavoriteUseCase } from '../create-resource-favorite.use-case';

describe('Use Cases -> Resource Favorite -> Create', () => {
  let createResourceFavoriteUseCase: CreateResourceFavoriteUseCase;

  const resource = new ResourceMock();
  const favorite = new ResourceFavoriteMock({
    resourceId: resource.id
  });

  const resourceFavoriteRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn()
  };

  const resourceRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateResourceFavoriteUseCase,
        {
          provide: RESOURCE_FAVORITE_REPOSITORY_TOKEN,
          useValue: resourceFavoriteRepositoryMock
        },
        {
          provide: RESOURCE_REPOSITORY_TOKEN,
          useValue: resourceRepositoryMock
        }
      ]
    }).compile();

    createResourceFavoriteUseCase = module.get<CreateResourceFavoriteUseCase>(CreateResourceFavoriteUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create resource favorite', async () => {
    resourceRepositoryMock.findOne.mockResolvedValue(resource);
    resourceFavoriteRepositoryMock.findOne.mockResolvedValue(null);
    resourceFavoriteRepositoryMock.create.mockResolvedValue(favorite);

    const input = {
      userId: favorite.userId,
      resourceId: favorite.resourceId
    };

    const result = await createResourceFavoriteUseCase.execute(input);

    expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.resourceId });
    expect(resourceFavoriteRepositoryMock.findOne).toHaveBeenCalledWith({
      userId: input.userId,
      resourceId: input.resourceId
    });
    expect(resourceFavoriteRepositoryMock.create).toHaveBeenCalledWith({
      userId: input.userId,
      resourceId: input.resourceId
    });
    expect(result).toEqual(favorite);
  });

  it('should not create resource favorite - resource not found', async () => {
    resourceRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      userId: favorite.userId,
      resourceId: favorite.resourceId
    };

    await expect(createResourceFavoriteUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceErrorCodes.NOT_FOUND)
    );
    expect(resourceFavoriteRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(resourceFavoriteRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should not create resource favorite - favorite already exists', async () => {
    resourceRepositoryMock.findOne.mockResolvedValue(resource);
    resourceFavoriteRepositoryMock.findOne.mockResolvedValue(favorite);

    const input = {
      userId: favorite.userId,
      resourceId: favorite.resourceId
    };

    await expect(createResourceFavoriteUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceFavoriteErrorCodes.ALREADY_EXISTS)
    );
    expect(resourceFavoriteRepositoryMock.create).not.toHaveBeenCalled();
  });
});
