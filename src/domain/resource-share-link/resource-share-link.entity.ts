import { ResourceEntity } from '../resource/resource.entity';
import { SharePermission } from '../resource-share/resource-share.interface';

import { IResourceShareLink } from './resource-share-link.interface';

export class ResourceShareLinkEntity implements IResourceShareLink {
  constructor(props: IResourceShareLink) {
    Object.assign(this, props);
  }

  id: string;
  resourceId: string;
  resource?: ResourceEntity;
  permission: SharePermission;
  createdAt: Date;
  updatedAt: Date;
}
