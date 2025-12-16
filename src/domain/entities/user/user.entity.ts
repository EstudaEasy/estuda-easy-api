import { IUser } from './user.interface';

export class UserEntity implements IUser {
  constructor(props: IUser) {
    Object.assign(this, props);
  }

  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  photoUrl?: string;
  birthdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
