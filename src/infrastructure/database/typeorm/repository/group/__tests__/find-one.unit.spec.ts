import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupModel } from '@database/typeorm/models/group/group.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';

import { GroupRepository } from '../group.repository';

describe('TypeOrm -> Group Repository -> Find One', () => {
  const groupMock = new GroupMock();

  let groupRepository: GroupRepository;
  let groupRepositoryMock: Repository<GroupModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    groupRepository = module.get<GroupRepository>(GroupRepository);
    groupRepositoryMock = module.get<Repository<GroupModel>>(getRepositoryToken(GroupModel));

    findOneSpy = jest.spyOn(groupRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(groupMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a group - group found', async () => {
    const res = await groupRepository.findOne({ id: groupMock.id });

    expect(res).toStrictEqual(groupMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - group not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await groupRepository.findOne({ id: groupMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
