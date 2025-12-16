export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  birthdate?: Date;
  phoneNumber?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RelationsUser = {};
