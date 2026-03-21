import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceFavoriteModel } from '@database/typeorm/models/resource-favorite/resource-favorite.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceFavoriteMock } from '@domain/resource-favorite/__mocks__/resource-favorite.mock';

import { ResourceFavoriteRepository } from '../resource-favorite.repository';

describe('TypeOrm -> ResourceFavorite Repository -> Find', () => {
  const favoriteMocks = ResourceFavoriteMock.getList(3);

  let favoriteRepository: ResourceFavoriteRepository;
  let favoriteRepositoryMock: Repository<ResourceFavoriteModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceFavoriteRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceFavoriteModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    favoriteRepository = module.get<ResourceFavoriteRepository>(ResourceFavoriteRepository);
    favoriteRepositoryMock = module.get<Repository<ResourceFavoriteModel>>(getRepositoryToken(ResourceFavoriteModel));

    findAndCountSpy = jest.spyOn(favoriteRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return resource favorites with count', async () => {
    findAndCountSpy.mockResolvedValue([favoriteMocks, favoriteMocks.length]);

    const res = await favoriteRepository.find();

    expect(res).toEqual({ favorites: favoriteMocks, total: 3 });
    expect(res.favorites).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no resource favorites found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await favoriteRepository.find();

    expect(res).toEqual({ favorites: [], total: 0 });
    expect(res.favorites).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
