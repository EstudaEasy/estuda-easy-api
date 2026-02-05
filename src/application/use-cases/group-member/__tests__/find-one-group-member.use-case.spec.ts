import { Test } from '@nestjs/testing';

import { Exception, GroupMemberErrorCodes } from '@application/errors';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { FindOneGroupMemberUseCase } from '../find-one-group-member.use-case';

describe('Use Cases -> GroupMember -> Find One', () => {
  let findOneGroupMemberUseCase: FindOneGroupMemberUseCase;

  const member = new GroupMemberMock();

  const groupMemberRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneGroupMemberUseCase,
        {
          provide: GROUP_MEMBER_REPOSITORY_TOKEN,
          useValue: groupMemberRepositoryMock
        }
      ]
    }).compile();

    findOneGroupMemberUseCase = module.get<FindOneGroupMemberUseCase>(FindOneGroupMemberUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one group member', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValue(member);

    const input = {
      filters: { id: member.id },
      relations: { user: true }
    };

    const result = await findOneGroupMemberUseCase.execute(input);

    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(member);
  });

  it('should not find group member - member not found', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: 0 }
    };

    await expect(findOneGroupMemberUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupMemberErrorCodes.NOT_FOUND)
    );
    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
