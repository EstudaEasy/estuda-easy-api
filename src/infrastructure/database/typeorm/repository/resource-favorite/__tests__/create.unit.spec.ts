import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceFavoriteModel } from '@database/typeorm/models/resource-favorite/resource-favorite.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';

import { ResourceFavoriteRepository } from '../resource-favorite.repository';

describe('TypeOrm -> ResourceFavorite Repository -> Create', () => {
  const favoriteMock = new ResourceFavoriteMock();

  let favoriteRepository: ResourceFavoriteRepository;
  let favoriteRepositoryMock: Repository<ResourceFavoriteModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceFavoriteRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceFavoriteModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    favoriteRepository = module.get<ResourceFavoriteRepository>(ResourceFavoriteRepository);
    favoriteRepositoryMock = module.get<Repository<ResourceFavoriteModel>>(getRepositoryToken(ResourceFavoriteModel));

    createSpy = jest.spyOn(favoriteRepositoryMock, 'create');
    createSpy.mockReturnValue(favoriteMock);

    saveSpy = jest.spyOn(favoriteRepositoryMock, 'save');
    saveSpy.mockResolvedValue(favoriteMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a resource favorite', async () => {
    const res = await favoriteRepository.create({
      userId: favoriteMock.userId,
      resourceId: favoriteMock.resourceId
    });

    expect(res).toStrictEqual(favoriteMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
