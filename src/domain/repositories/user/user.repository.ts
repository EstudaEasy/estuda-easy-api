import { IUser, RelationsUser } from '@domain/entities/user/user.interface';

export type CreateUser = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUser = Partial<Omit<CreateUser, 'email'>>;
export type WhereUser = Partial<IUser> | Partial<IUser>[];

export const UserRepositoryToken = 'IUserRepository';

export interface IUserRepository {
  create(data: CreateUser): Promise<IUser>;
  find(where?: WhereUser, relations?: RelationsUser): Promise<{ users: IUser[]; total: number }>;
  findOne(where: WhereUser, relations?: RelationsUser): Promise<IUser | null>;
  update(where: WhereUser, data: UpdateUser): Promise<IUser | null>;
  delete(where: WhereUser): Promise<boolean>;
}
