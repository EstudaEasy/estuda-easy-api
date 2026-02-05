import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceModel } from '@database/typeorm/models/resource/resource.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';

import { ResourceRepository } from '../resource.repository';

describe('TypeOrm -> Resource Repository -> Find', () => {
  const resourceMocks = ResourceMock.getList(3);

  let resourceRepository: ResourceRepository;
  let resourceRepositoryMock: Repository<ResourceModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    resourceRepository = module.get<ResourceRepository>(ResourceRepository);
    resourceRepositoryMock = module.get<Repository<ResourceModel>>(getRepositoryToken(ResourceModel));

    findAndCountSpy = jest.spyOn(resourceRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return resources with count', async () => {
    findAndCountSpy.mockResolvedValue([resourceMocks, resourceMocks.length]);

    const res = await resourceRepository.find();

    expect(res).toEqual({ resources: resourceMocks, total: 3 });
    expect(res.resources).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no resources found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await resourceRepository.find();

    expect(res).toEqual({ resources: [], total: 0 });
    expect(res.resources).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
