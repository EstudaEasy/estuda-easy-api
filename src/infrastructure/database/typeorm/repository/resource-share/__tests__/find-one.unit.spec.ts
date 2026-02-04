import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceShareModel } from '@database/typeorm/models/resource-share/resource-share.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';

import { ResourceShareRepository } from '../resource-share.repository';

describe('TypeOrm -> ResourceShare Repository -> Find One', () => {
  const shareMock = new ResourceShareMock();

  let shareRepository: ResourceShareRepository;
  let shareRepositoryMock: Repository<ResourceShareModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    shareRepository = module.get<ResourceShareRepository>(ResourceShareRepository);
    shareRepositoryMock = module.get<Repository<ResourceShareModel>>(getRepositoryToken(ResourceShareModel));

    findOneSpy = jest.spyOn(shareRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(shareMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a resource share - share found', async () => {
    const res = await shareRepository.findOne({ id: shareMock.id });

    expect(res).toStrictEqual(shareMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - share not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await shareRepository.findOne({ id: shareMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
