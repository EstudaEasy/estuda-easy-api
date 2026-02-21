import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { CacheProvider } from '../cache.provider';

describe('Providers -> Cache -> Get', () => {
  let cacheProvider: CacheProvider;

  const cacheManagerMock = {
    get: jest.fn().mockResolvedValue({ foo: 'bar' })
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

  it('should return cached value for key', async () => {
    const res = await cacheProvider.get<{ foo: string }>('some-key');

    expect(res).toStrictEqual({ foo: 'bar' });
    expect(cacheManagerMock.get).toHaveBeenCalledTimes(1);
    expect(cacheManagerMock.get).toHaveBeenCalledWith('some-key');
  });
});
