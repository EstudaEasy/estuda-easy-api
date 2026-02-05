import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupModel } from '@database/typeorm/models/group/group.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';

import { GroupRepository } from '../group.repository';

describe('TypeOrm -> Group Repository -> Find', () => {
  const groupMocks = GroupMock.getList(3);

  let groupRepository: GroupRepository;
  let groupRepositoryMock: Repository<GroupModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    groupRepository = module.get<GroupRepository>(GroupRepository);
    groupRepositoryMock = module.get<Repository<GroupModel>>(getRepositoryToken(GroupModel));

    findAndCountSpy = jest.spyOn(groupRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return groups with count', async () => {
    findAndCountSpy.mockResolvedValue([groupMocks, groupMocks.length]);

    const res = await groupRepository.find();

    expect(res).toEqual({ groups: groupMocks, total: 3 });
    expect(res.groups).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no groups found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await groupRepository.find();

    expect(res).toEqual({ groups: [], total: 0 });
    expect(res.groups).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
