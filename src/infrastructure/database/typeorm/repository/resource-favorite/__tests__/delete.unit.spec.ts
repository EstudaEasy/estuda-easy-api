import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ResourceFavoriteModel } from '@database/typeorm/models/resource-favorite/resource-favorite.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';

import { ResourceFavoriteRepository } from '../resource-favorite.repository';

describe('TypeOrm -> ResourceFavorite Repository -> Delete', () => {
  const favoriteMock = new ResourceFavoriteMock();

  let favoriteRepository: ResourceFavoriteRepository;
  let favoriteRepositoryMock: Repository<ResourceFavoriteModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceFavoriteRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceFavoriteModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    favoriteRepository = module.get<ResourceFavoriteRepository>(ResourceFavoriteRepository);
    favoriteRepositoryMock = module.get<Repository<ResourceFavoriteModel>>(getRepositoryToken(ResourceFavoriteModel));

    deleteSpy = jest.spyOn(favoriteRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a resource favorite and return true - favorite found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await favoriteRepository.delete({ id: favoriteMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - favorite not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await favoriteRepository.delete({ id: favoriteMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
