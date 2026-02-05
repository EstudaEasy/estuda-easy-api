import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupMemberModel } from '@database/typeorm/models/group-member/group-member.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';

import { GroupMemberRepository } from '../group-member.repository';

describe('TypeOrm -> GroupMember Repository -> Create', () => {
  const memberMock = new GroupMemberMock();

  let memberRepository: GroupMemberRepository;
  let memberRepositoryMock: Repository<GroupMemberModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupMemberRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupMemberModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    memberRepository = module.get<GroupMemberRepository>(GroupMemberRepository);
    memberRepositoryMock = module.get<Repository<GroupMemberModel>>(getRepositoryToken(GroupMemberModel));

    createSpy = jest.spyOn(memberRepositoryMock, 'create');
    createSpy.mockReturnValue(memberMock);

    saveSpy = jest.spyOn(memberRepositoryMock, 'save');
    saveSpy.mockResolvedValue(memberMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a group member', async () => {
    const res = await memberRepository.create({
      role: memberMock.role,
      groupId: memberMock.groupId,
      userId: memberMock.userId
    });

    expect(res).toStrictEqual(memberMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
