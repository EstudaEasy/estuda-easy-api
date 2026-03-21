import { Test } from '@nestjs/testing';

import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';
import { RESOURCE_FAVORITE_REPOSITORY_TOKEN } from '@domain/resource-favorite/resource-favorite.repository';

import { FindResourceFavoritesUseCase } from '../find-resource-favorites.use-case';

describe('Use Cases -> Resource Favorite -> Find', () => {
  let findResourceFavoritesUseCase: FindResourceFavoritesUseCase;

  const defaultRelations = {
    resource: {
      deck: true,
      diary: true,
      quiz: true,
      task: true,
      whiteboard: true
    }
  };

  const favorites = ResourceFavoriteMock.getList(2);
  const total = favorites.length;

  const resourceFavoriteRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindResourceFavoritesUseCase,
        {
          provide: RESOURCE_FAVORITE_REPOSITORY_TOKEN,
          useValue: resourceFavoriteRepositoryMock
        }
      ]
    }).compile();

    findResourceFavoritesUseCase = module.get<FindResourceFavoritesUseCase>(FindResourceFavoritesUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find resource favorites', async () => {
    resourceFavoriteRepositoryMock.find.mockResolvedValue({ favorites, total });

    const input = {
      filters: { userId: favorites[0].userId },
      relations: { resource: true }
    };

    const result = await findResourceFavoritesUseCase.execute(input);

    expect(resourceFavoriteRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.favorites).toEqual(favorites);
    expect(result.total).toBe(total);
  });

  it('should find resource favorites without filters', async () => {
    resourceFavoriteRepositoryMock.find.mockResolvedValue({ favorites, total });

    const result = await findResourceFavoritesUseCase.execute();

    expect(resourceFavoriteRepositoryMock.find).toHaveBeenCalledWith(undefined, defaultRelations);
    expect(result.favorites).toEqual(favorites);
    expect(result.total).toBe(total);
  });
});
