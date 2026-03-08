import { faker } from '@faker-js/faker';

import { IUserSession } from '../interface';

export class UserSessionMock implements IUserSession {
  public readonly jti: string;
  public readonly userId: number;
  public readonly ipAddress: string;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;

  constructor(partial?: Partial<IUserSession>) {
    this.jti = faker.string.alphanumeric(64);
    this.userId = faker.number.int({ min: 1, max: 1000 });
    this.ipAddress = faker.internet.ip();
    this.expiresAt = faker.date.future();
    this.createdAt = faker.date.past();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): IUserSession[] {
    return Array.from({ length }, () => new UserSessionMock());
  }
}
