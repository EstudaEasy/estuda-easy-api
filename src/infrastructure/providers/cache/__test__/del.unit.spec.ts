import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { CacheProvider } from '../cache.provider';

describe('Providers -> Cache -> Del', () => {
  let cacheProvider: CacheProvider;

  const cacheManagerMock = {
    del: jest.fn().mockResolvedValue(true)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheProvider,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock
        }
      ]
    }).compile();

    cacheProvider = module.get<CacheProvider>(CacheProvider);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete key from cache and return boolean', async () => {
    const res = await cacheProvider.del('some-key');

    expect(res).toStrictEqual(true);
    expect(cacheManagerMock.del).toHaveBeenCalledTimes(1);
    expect(cacheManagerMock.del).toHaveBeenCalledWith('some-key');
  });
});
