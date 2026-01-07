import { IUserSession } from '@domain/entities/user-session/interface';
import { DomainFilter } from '@shared/types';

export type CreateUserSession = Omit<IUserSession, 'createdAt' | 'user'>;
export type UpdateUserSession = Partial<CreateUserSession>;
export type FilterUserSession = DomainFilter<IUserSession> | DomainFilter<IUserSession>[];
export type RelationsUserSession = { user: boolean };

export const USER_SESSION_REPOSITORY_TOKEN = 'UserSessionRepository';

export interface IUserSessionRepository {
  create(data: CreateUserSession): Promise<IUserSession>;
  find(
    filters?: FilterUserSession,
    relations?: RelationsUserSession
  ): Promise<{ sessions: IUserSession[]; total: number }>;
  findOne(filters: FilterUserSession, relations?: RelationsUserSession): Promise<IUserSession | null>;
  update(filters: FilterUserSession, data: UpdateUserSession): Promise<IUserSession | null>;
  delete(filters: FilterUserSession): Promise<boolean>;
}
