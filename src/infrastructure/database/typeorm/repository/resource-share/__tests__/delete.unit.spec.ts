import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ResourceShareModel } from '@database/typeorm/models/resource-share/resource-share.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';

import { ResourceShareRepository } from '../resource-share.repository';

describe('TypeOrm -> ResourceShare Repository -> Delete', () => {
  const shareMock = new ResourceShareMock();

  let shareRepository: ResourceShareRepository;
  let shareRepositoryMock: Repository<ResourceShareModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    shareRepository = module.get<ResourceShareRepository>(ResourceShareRepository);
    shareRepositoryMock = module.get<Repository<ResourceShareModel>>(getRepositoryToken(ResourceShareModel));

    deleteSpy = jest.spyOn(shareRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a resource share and return true - share found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await shareRepository.delete({ id: shareMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - share not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await shareRepository.delete({ id: shareMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
