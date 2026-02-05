import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupMemberModel } from '@database/typeorm/models/group-member/group-member.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';

import { GroupMemberRepository } from '../group-member.repository';

describe('TypeOrm -> GroupMember Repository -> Find One', () => {
  const memberMock = new GroupMemberMock();

  let memberRepository: GroupMemberRepository;
  let memberRepositoryMock: Repository<GroupMemberModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupMemberRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupMemberModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    memberRepository = module.get<GroupMemberRepository>(GroupMemberRepository);
    memberRepositoryMock = module.get<Repository<GroupMemberModel>>(getRepositoryToken(GroupMemberModel));

    findOneSpy = jest.spyOn(memberRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(memberMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a group member - member found', async () => {
    const res = await memberRepository.findOne({ id: memberMock.id });

    expect(res).toStrictEqual(memberMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - member not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await memberRepository.findOne({ id: memberMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
