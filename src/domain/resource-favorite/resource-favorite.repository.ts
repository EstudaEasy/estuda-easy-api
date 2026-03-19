import { RelationsResource } from '@domain/resource/resource.repository';
import { IResourceFavorite } from '@domain/resource-favorite/resource-favorite.interface';
import { DomainFilter } from '@shared/types';

export type CreateResourceFavorite = Omit<IResourceFavorite, 'id' | 'user' | 'resource' | 'createdAt'>;
export type UpdateResourceFavorite = Partial<CreateResourceFavorite>;
export type FilterResourceFavorite = DomainFilter<IResourceFavorite> | DomainFilter<IResourceFavorite>[];
export type RelationsResourceFavorite = {
  user?: boolean;
  resource?: boolean | RelationsResource;
};

export const RESOURCE_FAVORITE_REPOSITORY_TOKEN = 'ResourceFavoriteRepositoryToken';

export interface IResourceFavoriteRepository {
  create(data: CreateResourceFavorite): Promise<IResourceFavorite>;
  find(
    filters?: FilterResourceFavorite,
    relations?: RelationsResourceFavorite
  ): Promise<{ favorites: IResourceFavorite[]; total: number }>;
  findOne(filters: FilterResourceFavorite, relations?: RelationsResourceFavorite): Promise<IResourceFavorite | null>;
  update(filters: FilterResourceFavorite, data: UpdateResourceFavorite): Promise<IResourceFavorite | null>;
  delete(filters: FilterResourceFavorite): Promise<boolean>;
}
