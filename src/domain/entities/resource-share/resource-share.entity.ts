import { GroupEntity } from '../group/group.entity';
import { ResourceEntity } from '../resource/resource.entity';
import { UserEntity } from '../user/user.entity';

import { IResourceShare, SharePermission } from './resource-share.interface';

export class ResourceShareEntity implements IResourceShare {
  constructor(props: IResourceShare) {
    Object.assign(this, props);
  }

  id: number;
  permission: SharePermission;
  resourceId: number;
  resource?: ResourceEntity;
  groupId?: string;
  group?: GroupEntity;
  userId?: number;
  user?: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
