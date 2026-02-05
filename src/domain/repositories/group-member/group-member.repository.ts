import { IGroupMember } from '@domain/entities/group-member/group-member.interface';
import { DomainFilter } from '@shared/types';

export type CreateGroupMember = Omit<IGroupMember, 'id' | 'group' | 'user' | 'createdAt' | 'updatedAt'>;
export type UpdateGroupMember = Partial<CreateGroupMember>;
export type FilterGroupMember = DomainFilter<IGroupMember> | DomainFilter<IGroupMember>[];
export type RelationsGroupMember = { group?: boolean; user?: boolean };

export const GROUP_MEMBER_REPOSITORY_TOKEN = 'GroupMemberRepositoryToken';

export interface IGroupMemberRepository {
  create(data: CreateGroupMember): Promise<IGroupMember>;
  find(
    filters?: FilterGroupMember,
    relations?: RelationsGroupMember
  ): Promise<{ members: IGroupMember[]; total: number }>;
  findOne(filters: FilterGroupMember, relations?: RelationsGroupMember): Promise<IGroupMember | null>;
  update(filters: FilterGroupMember, data: UpdateGroupMember): Promise<IGroupMember | null>;
  delete(filters: FilterGroupMember): Promise<boolean>;
}
