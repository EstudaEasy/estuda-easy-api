import { IResource } from '../resource/resource.interface';
import { IUser } from '../user/user.interface';

export enum SharePermission {
  READ = 'read',
  EDIT = 'edit',
  ADMIN = 'admin'
}

export interface IResourceShare {
  id: number;
  permission: SharePermission;
  resourceId: number;
  resource?: IResource;
  userId: number;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
}
