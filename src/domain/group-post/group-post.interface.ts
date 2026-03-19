import { IGroup } from '../group/group.interface';
import { IUser } from '../user/user.interface';

export interface IGroupPost {
  id: string;
  content: string;
  groupId: string;
  group?: IGroup;
  authorId: number;
  author?: IUser;
  createdAt: Date;
  updatedAt: Date;
}
