import { IUser } from '@domain/entities/user/user.interface';
import { DomainFilter } from '@shared/types';

export type CreateUser = Omit<IUser, 'id' | 'role' | 'createdAt' | 'updatedAt'>;
export type UpdateUser = Partial<Omit<CreateUser, 'email'>>;
export type FilterUser = DomainFilter<IUser> | DomainFilter<IUser>[];
export type RelationsUser = object;

export const USER_REPOSITORY_TOKEN = 'UserRepositoryToken';

export interface IUserRepository {
  create(data: CreateUser): Promise<IUser>;
  find(filters?: FilterUser, relations?: RelationsUser): Promise<{ users: IUser[]; total: number }>;
  findOne(filters: FilterUser, relations?: RelationsUser): Promise<IUser | null>;
  update(filters: FilterUser, data: UpdateUser): Promise<IUser | null>;
  delete(filters: FilterUser): Promise<boolean>;
}
