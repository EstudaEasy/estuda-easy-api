import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { GroupMemberModel } from '@database/typeorm/models/group-member/group-member.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';

import { GroupMemberRepository } from '../group-member.repository';

describe('TypeOrm -> GroupMember Repository -> Update', () => {
  const memberMock = new GroupMemberMock();

  let memberRepository: GroupMemberRepository;
  let memberRepositoryMock: Repository<GroupMemberModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupMemberRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupMemberModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    memberRepository = module.get<GroupMemberRepository>(GroupMemberRepository);
    memberRepositoryMock = module.get<Repository<GroupMemberModel>>(getRepositoryToken(GroupMemberModel));

    updateSpy = jest.spyOn(memberRepositoryMock, 'update');
    findOneSpy = jest.spyOn(memberRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a group member - member updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(memberMock);

    const res = await memberRepository.update({ id: memberMock.id }, { role: GroupMemberRole.ADMIN });

    expect(res).toStrictEqual(memberMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - member not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await memberRepository.update({ id: memberMock.id }, { role: GroupMemberRole.ADMIN });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
