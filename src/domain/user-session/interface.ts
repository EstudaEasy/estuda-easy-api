import { IUser } from '../user/user.interface';

export interface IUserSession {
  jti: string;
  userId: number;
  ipAddress: string;
  user?: IUser;
  expiresAt: Date;
  createdAt: Date;
}
