import { IResource } from '../resource/resource.interface';
import { IUser } from '../user/user.interface';

export interface IResourceFavorite {
  id: string;
  userId: number;
  user?: IUser;
  resourceId: string;
  resource?: IResource;
  createdAt: Date;
}
