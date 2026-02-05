import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceModel } from '@database/typeorm/models/resource/resource.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';

import { ResourceRepository } from '../resource.repository';

describe('TypeOrm -> Resource Repository -> Find One', () => {
  const resourceMock = new ResourceMock();

  let resourceRepository: ResourceRepository;
  let resourceRepositoryMock: Repository<ResourceModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    resourceRepository = module.get<ResourceRepository>(ResourceRepository);
    resourceRepositoryMock = module.get<Repository<ResourceModel>>(getRepositoryToken(ResourceModel));

    findOneSpy = jest.spyOn(resourceRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(resourceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a resource - resource found', async () => {
    const res = await resourceRepository.findOne({ id: resourceMock.id });

    expect(res).toStrictEqual(resourceMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - resource not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await resourceRepository.findOne({ id: resourceMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
