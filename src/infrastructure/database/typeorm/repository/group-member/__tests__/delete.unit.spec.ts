import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { GroupMemberModel } from '@database/typeorm/models/group-member/group-member.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';

import { GroupMemberRepository } from '../group-member.repository';

describe('TypeOrm -> GroupMember Repository -> Delete', () => {
  const memberMock = new GroupMemberMock();

  let memberRepository: GroupMemberRepository;
  let memberRepositoryMock: Repository<GroupMemberModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupMemberRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupMemberModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    memberRepository = module.get<GroupMemberRepository>(GroupMemberRepository);
    memberRepositoryMock = module.get<Repository<GroupMemberModel>>(getRepositoryToken(GroupMemberModel));

    deleteSpy = jest.spyOn(memberRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a group member and return true - member found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await memberRepository.delete({ id: memberMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - member not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await memberRepository.delete({ id: memberMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
