import { Test } from '@nestjs/testing';

import { ResourceFavoriteErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';
import { RESOURCE_FAVORITE_REPOSITORY_TOKEN } from '@domain/resource-favorite/resource-favorite.repository';

import { FindOneResourceFavoriteUseCase } from '../find-one-resource-favorite.use-case';

describe('Use Cases -> Resource Favorite -> Find One', () => {
  let findOneResourceFavoriteUseCase: FindOneResourceFavoriteUseCase;

  const defaultRelations = {
    resource: {
      deck: true,
      diary: true,
      quiz: true,
      task: true,
      whiteboard: true
    }
  };

  const favorite = new ResourceFavoriteMock();

  const resourceFavoriteRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneResourceFavoriteUseCase,
        {
          provide: RESOURCE_FAVORITE_REPOSITORY_TOKEN,
          useValue: resourceFavoriteRepositoryMock
        }
      ]
    }).compile();

    findOneResourceFavoriteUseCase = module.get<FindOneResourceFavoriteUseCase>(FindOneResourceFavoriteUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one resource favorite', async () => {
    resourceFavoriteRepositoryMock.findOne.mockResolvedValue(favorite);

    const input = {
      filters: { id: favorite.id },
      relations: { resource: true }
    };

    const result = await findOneResourceFavoriteUseCase.execute(input);

    expect(resourceFavoriteRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(favorite);
  });

  it('should not find one favorite - favorite not found', async () => {
    resourceFavoriteRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: favorite.id }
    };

    await expect(findOneResourceFavoriteUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceFavoriteErrorCodes.NOT_FOUND)
    );
    expect(resourceFavoriteRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, defaultRelations);
  });
});
