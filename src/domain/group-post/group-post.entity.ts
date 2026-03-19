import { GroupEntity } from '../group/group.entity';
import { UserEntity } from '../user/user.entity';

import { IGroupPost } from './group-post.interface';

export class GroupPostEntity implements IGroupPost {
  constructor(props: IGroupPost) {
    Object.assign(this, props);
  }

  id: string;
  content: string;
  groupId: string;
  group?: GroupEntity;
  authorId: number;
  author?: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
