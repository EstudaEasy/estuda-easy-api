import { IGroup } from '../group/group.interface';
import { IUser } from '../user/user.interface';

export enum GroupMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface IGroupMember {
  id: number;
  role: GroupMemberRole;
  groupId: string;
  group?: IGroup;
  userId: number;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
}
