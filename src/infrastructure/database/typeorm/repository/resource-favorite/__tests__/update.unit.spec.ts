import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { ResourceFavoriteModel } from '@database/typeorm/models/resource-favorite/resource-favorite.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';

import { ResourceFavoriteRepository } from '../resource-favorite.repository';

describe('TypeOrm -> ResourceFavorite Repository -> Update', () => {
  const favoriteMock = new ResourceFavoriteMock();

  let favoriteRepository: ResourceFavoriteRepository;
  let favoriteRepositoryMock: Repository<ResourceFavoriteModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceFavoriteRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceFavoriteModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    favoriteRepository = module.get<ResourceFavoriteRepository>(ResourceFavoriteRepository);
    favoriteRepositoryMock = module.get<Repository<ResourceFavoriteModel>>(getRepositoryToken(ResourceFavoriteModel));

    updateSpy = jest.spyOn(favoriteRepositoryMock, 'update');
    findOneSpy = jest.spyOn(favoriteRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a resource favorite - favorite updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(favoriteMock);

    const res = await favoriteRepository.update({ id: favoriteMock.id }, { resourceId: favoriteMock.resourceId });

    expect(res).toStrictEqual(favoriteMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - favorite not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await favoriteRepository.update({ id: favoriteMock.id }, { resourceId: favoriteMock.resourceId });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
