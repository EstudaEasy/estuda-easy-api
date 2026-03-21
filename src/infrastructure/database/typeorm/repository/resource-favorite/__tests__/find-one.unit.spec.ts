import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceFavoriteModel } from '@database/typeorm/models/resource-favorite/resource-favorite.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';

import { ResourceFavoriteRepository } from '../resource-favorite.repository';

describe('TypeOrm -> ResourceFavorite Repository -> Find One', () => {
  const favoriteMock = new ResourceFavoriteMock();

  let favoriteRepository: ResourceFavoriteRepository;
  let favoriteRepositoryMock: Repository<ResourceFavoriteModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceFavoriteRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceFavoriteModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    favoriteRepository = module.get<ResourceFavoriteRepository>(ResourceFavoriteRepository);
    favoriteRepositoryMock = module.get<Repository<ResourceFavoriteModel>>(getRepositoryToken(ResourceFavoriteModel));

    findOneSpy = jest.spyOn(favoriteRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(favoriteMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a resource favorite - favorite found', async () => {
    const res = await favoriteRepository.findOne({ id: favoriteMock.id });

    expect(res).toStrictEqual(favoriteMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - favorite not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await favoriteRepository.findOne({ id: favoriteMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
