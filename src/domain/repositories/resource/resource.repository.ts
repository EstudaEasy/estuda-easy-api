import { IResource } from '@domain/entities/resource/resource.interface';
import { DomainFilter } from '@shared/types';

export type CreateResource = Pick<IResource, 'type' | 'userId'>;
export type UpdateResource = Partial<CreateResource>;
export type FilterResource = DomainFilter<IResource> | DomainFilter<IResource>[];
export type RelationsResource = { user?: boolean; quiz?: boolean; shares?: boolean };

export const RESOURCE_REPOSITORY_TOKEN = 'ResourceRepositoryToken';

export interface IResourceRepository {
  create(data: CreateResource): Promise<IResource>;
  find(filters?: FilterResource, relations?: RelationsResource): Promise<{ resources: IResource[]; total: number }>;
  findOne(filters: FilterResource, relations?: RelationsResource): Promise<IResource | null>;
  update(filters: FilterResource, data: UpdateResource): Promise<IResource | null>;
  delete(filters: FilterResource): Promise<boolean>;
}
