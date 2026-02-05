import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { ResourceModel } from '@database/typeorm/models/resource/resource.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';
import { ResourceType } from '@domain/entities/resource/resource.interface';

import { ResourceRepository } from '../resource.repository';

describe('TypeOrm -> Resource Repository -> Update', () => {
  const resourceMock = new ResourceMock();

  let resourceRepository: ResourceRepository;
  let resourceRepositoryMock: Repository<ResourceModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    resourceRepository = module.get<ResourceRepository>(ResourceRepository);
    resourceRepositoryMock = module.get<Repository<ResourceModel>>(getRepositoryToken(ResourceModel));

    updateSpy = jest.spyOn(resourceRepositoryMock, 'update');
    findOneSpy = jest.spyOn(resourceRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a resource - resource updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(resourceMock);

    const res = await resourceRepository.update({ id: resourceMock.id }, { type: ResourceType.QUIZ });

    expect(res).toStrictEqual(resourceMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - resource not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await resourceRepository.update({ id: resourceMock.id }, { type: ResourceType.QUIZ });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
