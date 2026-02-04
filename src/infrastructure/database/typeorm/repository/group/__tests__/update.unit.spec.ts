import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { GroupModel } from '@database/typeorm/models/group/group.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';

import { GroupRepository } from '../group.repository';

describe('TypeOrm -> Group Repository -> Update', () => {
  const groupMock = new GroupMock();

  let groupRepository: GroupRepository;
  let groupRepositoryMock: Repository<GroupModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    groupRepository = module.get<GroupRepository>(GroupRepository);
    groupRepositoryMock = module.get<Repository<GroupModel>>(getRepositoryToken(GroupModel));

    updateSpy = jest.spyOn(groupRepositoryMock, 'update');
    findOneSpy = jest.spyOn(groupRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a group - group updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(groupMock);

    const res = await groupRepository.update({ id: groupMock.id }, { name: 'Updated Group' });

    expect(res).toStrictEqual(groupMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - group not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await groupRepository.update({ id: groupMock.id }, { name: 'Updated Group' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
