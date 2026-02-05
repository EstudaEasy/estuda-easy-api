import { IGroup } from '@domain/entities/group/group.interface';
import { DomainFilter } from '@shared/types';

export type CreateGroup = Omit<IGroup, 'id' | 'members' | 'resources' | 'createdAt' | 'updatedAt'>;
export type UpdateGroup = Partial<CreateGroup>;
export type FilterGroup = DomainFilter<IGroup> | DomainFilter<IGroup>[];
export type RelationsGroup = { members?: boolean; resources?: boolean };

export const GROUP_REPOSITORY_TOKEN = 'GroupRepositoryToken';

export interface IGroupRepository {
  create(data: CreateGroup): Promise<IGroup>;
  find(filters?: FilterGroup, relations?: RelationsGroup): Promise<{ groups: IGroup[]; total: number }>;
  findOne(filters: FilterGroup, relations?: RelationsGroup): Promise<IGroup | null>;
  update(filters: FilterGroup, data: UpdateGroup): Promise<IGroup | null>;
  delete(filters: FilterGroup): Promise<boolean>;
}
