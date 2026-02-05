import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupMemberModel } from '@database/typeorm/models/group-member/group-member.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';

import { GroupMemberRepository } from '../group-member.repository';

describe('TypeOrm -> GroupMember Repository -> Find', () => {
  const memberMocks = GroupMemberMock.getList(3);

  let memberRepository: GroupMemberRepository;
  let memberRepositoryMock: Repository<GroupMemberModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupMemberRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupMemberModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    memberRepository = module.get<GroupMemberRepository>(GroupMemberRepository);
    memberRepositoryMock = module.get<Repository<GroupMemberModel>>(getRepositoryToken(GroupMemberModel));

    findAndCountSpy = jest.spyOn(memberRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return group members with count', async () => {
    findAndCountSpy.mockResolvedValue([memberMocks, memberMocks.length]);

    const res = await memberRepository.find();

    expect(res).toEqual({ members: memberMocks, total: 3 });
    expect(res.members).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no group members found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await memberRepository.find();

    expect(res).toEqual({ members: [], total: 0 });
    expect(res.members).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
