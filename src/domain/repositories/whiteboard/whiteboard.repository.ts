import { IWhiteboard } from '@domain/entities/whiteboard/whiteboard.interface';
import { DomainFilter } from '@shared/types';

export type CreateWhiteboard = Omit<IWhiteboard, 'id' | 'resourceId' | 'createdAt' | 'updatedAt'>;
export type UpdateWhiteboard = Partial<Omit<CreateWhiteboard, 'resource'>>;
export type FilterWhiteboard = DomainFilter<IWhiteboard> | DomainFilter<IWhiteboard>[];
export type RelationsWhiteboard = { resource?: boolean };

export const WHITEBOARD_REPOSITORY_TOKEN = 'WhiteboardRepositoryToken';

export interface IWhiteboardRepository {
  create(data: CreateWhiteboard): Promise<IWhiteboard>;
  find(
    filters?: FilterWhiteboard,
    relations?: RelationsWhiteboard
  ): Promise<{ whiteboards: IWhiteboard[]; total: number }>;
  findOne(filters: FilterWhiteboard, relations?: RelationsWhiteboard): Promise<IWhiteboard | null>;
  update(filters: FilterWhiteboard, data: UpdateWhiteboard): Promise<IWhiteboard | null>;
  delete(filters: FilterWhiteboard): Promise<boolean>;
}
