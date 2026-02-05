import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { GroupModel } from '@database/typeorm/models/group/group.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';

import { GroupRepository } from '../group.repository';

describe('TypeOrm -> Group Repository -> Delete', () => {
  const groupMock = new GroupMock();

  let groupRepository: GroupRepository;
  let groupRepositoryMock: Repository<GroupModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    groupRepository = module.get<GroupRepository>(GroupRepository);
    groupRepositoryMock = module.get<Repository<GroupModel>>(getRepositoryToken(GroupModel));

    deleteSpy = jest.spyOn(groupRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a group and return true - group found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await groupRepository.delete({ id: groupMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - group not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await groupRepository.delete({ id: groupMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
