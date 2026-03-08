import { IResource } from '../resource/resource.interface';
import { SharePermission } from '../resource-share/resource-share.interface';

export interface IResourceShareLink {
  id: string;
  resourceId: string;
  resource?: IResource;
  permission: SharePermission;
  createdAt: Date;
  updatedAt: Date;
}
