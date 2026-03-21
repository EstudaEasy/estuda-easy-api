export interface IUser {
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

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
