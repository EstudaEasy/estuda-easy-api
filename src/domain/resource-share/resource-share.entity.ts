import { ResourceEntity } from '../resource/resource.entity';
import { UserEntity } from '../user/user.entity';

import { IResourceShare, SharePermission } from './resource-share.interface';

export class ResourceShareEntity implements IResourceShare {
  constructor(props: IResourceShare) {
    Object.assign(this, props);
  }

  id: number;
  permission: SharePermission;
  resourceId: string;
  resource?: ResourceEntity;
  userId: number;
  user?: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
