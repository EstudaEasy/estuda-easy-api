import { GroupEntity } from '../group/group.entity';
import { UserEntity } from '../user/user.entity';

import { GroupMemberRole, IGroupMember } from './group-member.interface';

export class GroupMemberEntity implements IGroupMember {
  constructor(props: IGroupMember) {
    Object.assign(this, props);
  }

  id: number;
  role: GroupMemberRole;
  groupId: string;
  group?: GroupEntity;
  userId: number;
  user?: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
