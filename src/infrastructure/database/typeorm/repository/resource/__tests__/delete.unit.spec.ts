import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ResourceModel } from '@database/typeorm/models/resource/resource.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';

import { ResourceRepository } from '../resource.repository';

describe('TypeOrm -> Resource Repository -> Delete', () => {
  const resourceMock = new ResourceMock();

  let resourceRepository: ResourceRepository;
  let resourceRepositoryMock: Repository<ResourceModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    resourceRepository = module.get<ResourceRepository>(ResourceRepository);
    resourceRepositoryMock = module.get<Repository<ResourceModel>>(getRepositoryToken(ResourceModel));

    deleteSpy = jest.spyOn(resourceRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a resource and return true - resource found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await resourceRepository.delete({ id: resourceMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - resource not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await resourceRepository.delete({ id: resourceMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
