import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { CacheProvider } from '../cache.provider';

describe('Providers -> Cache -> Set', () => {
  let cacheProvider: CacheProvider;

  const cacheManagerMock = {
    set: jest.fn().mockResolvedValue({ foo: 'bar' })
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

  it('should set value in cache and return it', async () => {
    const res = await cacheProvider.set('some-key', { foo: 'bar' }, 10);

    expect(res).toStrictEqual({ foo: 'bar' });
    expect(cacheManagerMock.set).toHaveBeenCalledTimes(1);
    expect(cacheManagerMock.set).toHaveBeenCalledWith('some-key', { foo: 'bar' }, 10);
  });
});
