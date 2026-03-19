import { GroupMemberEntity } from '../group-member/group-member.entity';
import { GroupPostEntity } from '../group-post/group-post.entity';
import { ResourceShareEntity } from '../resource-share/resource-share.entity';

import { IGroup } from './group.interface';

export class GroupEntity implements IGroup {
  constructor(props: IGroup) {
    Object.assign(this, props);
  }

  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  members?: GroupMemberEntity[];
  resources?: ResourceShareEntity[];
  posts?: GroupPostEntity[];
  createdAt: Date;
  updatedAt: Date;
}
