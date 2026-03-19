import { IGroupMember } from '../group-member/group-member.interface';
import { IGroupPost } from '../group-post/group-post.interface';
import { IResourceShare } from '../resource-share/resource-share.interface';

export interface IGroup {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  members?: IGroupMember[];
  resources?: IResourceShare[];
  posts?: IGroupPost[];
  createdAt: Date;
  updatedAt: Date;
}
