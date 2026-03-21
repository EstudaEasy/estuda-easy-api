import { IUser, UserRole } from './user.interface';

export class UserEntity implements IUser {
  constructor(props: IUser) {
    Object.assign(this, props);
  }

  id: number;
  name: string;
  email: string;
  password: string;
  birthdate?: Date;
  phoneNumber?: string;
  photoUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
