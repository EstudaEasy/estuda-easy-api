import { GroupMemberEntity } from '../group-member/group-member.entity';
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
  createdAt: Date;
  updatedAt: Date;
}
