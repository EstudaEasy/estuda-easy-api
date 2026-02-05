import { IGroupMember } from '../group-member/group-member.interface';
import { IResourceShare } from '../resource-share/resource-share.interface';

export interface IGroup {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  members?: IGroupMember[];
  resources?: IResourceShare[];
  createdAt: Date;
  updatedAt: Date;
}
