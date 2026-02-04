import { IResourceShare } from '@domain/entities/resource-share/resource-share.interface';
import { DomainFilter } from '@shared/types';

export type CreateResourceShare = Omit<
  IResourceShare,
  'id' | 'resource' | 'group' | 'user' | 'createdAt' | 'updatedAt'
>;
export type UpdateResourceShare = Partial<CreateResourceShare>;
export type FilterResourceShare = DomainFilter<IResourceShare> | DomainFilter<IResourceShare>[];
export type RelationsResourceShare = { resource?: boolean; group?: boolean; user?: boolean };

export const RESOURCE_SHARE_REPOSITORY_TOKEN = 'ResourceShareRepositoryToken';

export interface IResourceShareRepository {
  create(data: CreateResourceShare): Promise<IResourceShare>;
  find(
    filters?: FilterResourceShare,
    relations?: RelationsResourceShare
  ): Promise<{ shares: IResourceShare[]; total: number }>;
  findOne(filters: FilterResourceShare, relations?: RelationsResourceShare): Promise<IResourceShare | null>;
  update(filters: FilterResourceShare, data: UpdateResourceShare): Promise<IResourceShare | null>;
  delete(filters: FilterResourceShare): Promise<boolean>;
}
