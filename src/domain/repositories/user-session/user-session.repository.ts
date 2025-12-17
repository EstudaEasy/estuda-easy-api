import { IUserSession } from '@domain/entities/user-session/interface';

export type CreateUserSession = Omit<IUserSession, 'createdAt' | 'user'>;
export type UpdateUserSession = Partial<CreateUserSession>;
export type WhereUserSession = Partial<IUserSession> | Partial<IUserSession>[];
export type RelationsUserSession = { user: boolean };

export const UserSessionRepositoryToken = 'UserSessionRepository';

export interface IUserSessionRepository {
  create(data: CreateUserSession): Promise<IUserSession>;
  find(
    where?: WhereUserSession,
    relations?: RelationsUserSession
  ): Promise<{ sessions: IUserSession[]; total: number }>;
  findOne(where: WhereUserSession, relations?: RelationsUserSession): Promise<IUserSession | null>;
  update(where: WhereUserSession, data: UpdateUserSession): Promise<IUserSession | null>;
  delete(where: WhereUserSession): Promise<boolean>;
}
