import { IResourceShareLink } from '@domain/entities/resource-share-link/resource-share-link.interface';
import { DomainFilter } from '@shared/types';

export type CreateResourceShareLink = Omit<IResourceShareLink, 'id' | 'resource' | 'createdAt' | 'updatedAt'>;
export type UpdateResourceShareLink = Partial<Omit<CreateResourceShareLink, 'resourceId'>>;
export type FilterResourceShareLink = DomainFilter<IResourceShareLink> | DomainFilter<IResourceShareLink>[];
export type RelationsResourceShareLink = { resource?: boolean };

export const RESOURCE_SHARE_LINK_REPOSITORY_TOKEN = 'ResourceShareLinkRepositoryToken';

export interface IResourceShareLinkRepository {
  create(data: CreateResourceShareLink): Promise<IResourceShareLink>;
  find(
    filters?: FilterResourceShareLink,
    relations?: RelationsResourceShareLink
  ): Promise<{ shareLinks: IResourceShareLink[]; total: number }>;
  findOne(filters: FilterResourceShareLink, relations?: RelationsResourceShareLink): Promise<IResourceShareLink | null>;
  update(filters: FilterResourceShareLink, data: UpdateResourceShareLink): Promise<IResourceShareLink | null>;
  delete(filters: FilterResourceShareLink): Promise<boolean>;
}
