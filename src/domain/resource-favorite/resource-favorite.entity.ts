import { ResourceEntity } from '../resource/resource.entity';
import { UserEntity } from '../user/user.entity';

import { IResourceFavorite } from './resource-favorite.interface';

export class ResourceFavoriteEntity implements IResourceFavorite {
  constructor(props: IResourceFavorite) {
    Object.assign(this, props);
  }

  id: string;
  userId: number;
  user?: UserEntity;
  resourceId: string;
  resource?: ResourceEntity;
  createdAt: Date;
}
