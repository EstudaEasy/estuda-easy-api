import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { CacheProvider } from '../cache.provider';

describe('Providers -> Cache -> Clear', () => {
  let cacheProvider: CacheProvider;

  const cacheManagerMock = {
    clear: jest.fn().mockResolvedValue(true)
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

  it('should clear cache and return boolean', async () => {
    const res = await cacheProvider.clear();

    expect(res).toStrictEqual(true);
    expect(cacheManagerMock.clear).toHaveBeenCalledTimes(1);
  });
});
