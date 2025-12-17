import { IUserSession } from './interface';

import { UserEntity } from '../user/user.entity';

export class UserSessionEntity implements IUserSession {
  constructor(props: IUserSession) {
    Object.assign(this, props);
  }

  jti: string;
  userId: number;
  ipAddress: string;
  user?: UserEntity;
  expiresAt: Date;
  createdAt: Date;
}
