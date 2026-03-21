import { Test } from '@nestjs/testing';

import { ResourceFavoriteErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';
import { RESOURCE_FAVORITE_REPOSITORY_TOKEN } from '@domain/resource-favorite/resource-favorite.repository';

import { DeleteResourceFavoriteUseCase } from '../delete-resource-favorite.use-case';

describe('Use Cases -> Resource Favorite -> Delete', () => {
  let deleteResourceFavoriteUseCase: DeleteResourceFavoriteUseCase;

  const favorite = new ResourceFavoriteMock({ userId: 1 });

  const resourceFavoriteRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteResourceFavoriteUseCase,
        {
          provide: RESOURCE_FAVORITE_REPOSITORY_TOKEN,
          useValue: resourceFavoriteRepositoryMock
        }
      ]
    }).compile();

    deleteResourceFavoriteUseCase = module.get<DeleteResourceFavoriteUseCase>(DeleteResourceFavoriteUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete resource favorite', async () => {
    resourceFavoriteRepositoryMock.findOne.mockResolvedValue(favorite);
    resourceFavoriteRepositoryMock.delete.mockResolvedValue(true);

    const input = { favoriteId: favorite.id, userId: favorite.userId };

    await expect(deleteResourceFavoriteUseCase.execute(input)).resolves.toBeUndefined();

    expect(resourceFavoriteRepositoryMock.findOne).toHaveBeenCalledWith({ id: favorite.id });
    expect(resourceFavoriteRepositoryMock.delete).toHaveBeenCalledWith({ id: favorite.id });
  });

  it('should not delete favorite - favorite not found', async () => {
    resourceFavoriteRepositoryMock.findOne.mockResolvedValue(null);

    const input = { favoriteId: favorite.id, userId: favorite.userId };

    await expect(deleteResourceFavoriteUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceFavoriteErrorCodes.NOT_FOUND)
    );
    expect(resourceFavoriteRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete favorite - permission denied', async () => {
    resourceFavoriteRepositoryMock.findOne.mockResolvedValue(favorite);

    const input = { favoriteId: favorite.id, userId: 999 };

    await expect(deleteResourceFavoriteUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceFavoriteErrorCodes.PERMISSION_DENIED)
    );
    expect(resourceFavoriteRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete favorite - delete operation failed', async () => {
    resourceFavoriteRepositoryMock.findOne.mockResolvedValue(favorite);
    resourceFavoriteRepositoryMock.delete.mockResolvedValue(false);

    const input = { favoriteId: favorite.id, userId: favorite.userId };

    await expect(deleteResourceFavoriteUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceFavoriteErrorCodes.NOT_DELETED)
    );
  });
});
