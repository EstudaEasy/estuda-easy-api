import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupModel } from '@database/typeorm/models/group/group.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';

import { GroupRepository } from '../group.repository';

describe('TypeOrm -> Group Repository -> Create', () => {
  const groupMock = new GroupMock();

  let groupRepository: GroupRepository;
  let groupRepositoryMock: Repository<GroupModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    groupRepository = module.get<GroupRepository>(GroupRepository);
    groupRepositoryMock = module.get<Repository<GroupModel>>(getRepositoryToken(GroupModel));

    createSpy = jest.spyOn(groupRepositoryMock, 'create');
    createSpy.mockReturnValue(groupMock);

    saveSpy = jest.spyOn(groupRepositoryMock, 'save');
    saveSpy.mockResolvedValue(groupMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a group', async () => {
    const res = await groupRepository.create({
      name: groupMock.name,
      description: groupMock.description,
      inviteCode: groupMock.inviteCode
    });

    expect(res).toStrictEqual(groupMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
