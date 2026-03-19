import { DomainFilter } from '@shared/types';

import { IGroupPost } from '../group-post/group-post.interface';

export type CreateGroupPost = Omit<IGroupPost, 'id' | 'group' | 'author' | 'createdAt' | 'updatedAt'>;
export type UpdateGroupPost = Partial<CreateGroupPost>;
export type FilterGroupPost = DomainFilter<IGroupPost> | DomainFilter<IGroupPost>[];
export type RelationsGroupPost = { group?: boolean; author?: boolean };

export const GROUP_POST_REPOSITORY_TOKEN = 'GroupPostRepositoryToken';

export interface IGroupPostRepository {
  create(data: CreateGroupPost): Promise<IGroupPost>;
  find(filters?: FilterGroupPost, relations?: RelationsGroupPost): Promise<{ posts: IGroupPost[]; total: number }>;
  findOne(filters: FilterGroupPost, relations?: RelationsGroupPost): Promise<IGroupPost | null>;
  update(filters: FilterGroupPost, data: UpdateGroupPost): Promise<IGroupPost | null>;
  delete(filters: FilterGroupPost): Promise<boolean>;
}
