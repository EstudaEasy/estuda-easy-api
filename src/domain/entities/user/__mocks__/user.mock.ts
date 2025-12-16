import { faker } from '@faker-js/faker';

import { IUser } from '../user.interface';

export class UserMock implements IUser {
  public readonly id: number;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly birthdate?: Date;
  public readonly phoneNumber?: string;
  public readonly photoUrl?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor() {
    this.id = faker.number.int({ min: 1, max: 1000 });
    this.name = faker.person.fullName();
    this.email = faker.internet.email();
    this.password = faker.internet.password();
    this.birthdate = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
    this.phoneNumber = faker.phone.number();
    this.photoUrl = faker.image.url();
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
  }

  public static getList(length: number = 2): IUser[] {
    return Array.from({ length }, () => new UserMock());
  }
}
