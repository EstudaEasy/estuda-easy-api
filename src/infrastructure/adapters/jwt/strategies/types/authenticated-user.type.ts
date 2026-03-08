import { UserRole } from '@domain/user/user.interface';

export type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};
