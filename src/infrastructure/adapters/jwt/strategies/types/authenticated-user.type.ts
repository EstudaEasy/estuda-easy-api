import { UserRole } from '@domain/entities/user/user.interface';

export type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};
