import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceModel } from '@database/typeorm/models/resource/resource.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';

import { ResourceRepository } from '../resource.repository';

describe('TypeOrm -> Resource Repository -> Create', () => {
  const resourceMock = new ResourceMock();

  let resourceRepository: ResourceRepository;
  let resourceRepositoryMock: Repository<ResourceModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    resourceRepository = module.get<ResourceRepository>(ResourceRepository);
    resourceRepositoryMock = module.get<Repository<ResourceModel>>(getRepositoryToken(ResourceModel));

    createSpy = jest.spyOn(resourceRepositoryMock, 'create');
    createSpy.mockReturnValue(resourceMock);

    saveSpy = jest.spyOn(resourceRepositoryMock, 'save');
    saveSpy.mockResolvedValue(resourceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a resource', async () => {
    const res = await resourceRepository.create({
      type: resourceMock.type,
      userId: resourceMock.userId
    });

    expect(res).toStrictEqual(resourceMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
