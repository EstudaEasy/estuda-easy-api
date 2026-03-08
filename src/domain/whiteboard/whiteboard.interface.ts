import { IResource } from '../resource/resource.interface';

export interface IWhiteboard {
  id: string;
  title: string;
  content: any;
  resourceId: string;
  resource?: IResource;
  createdAt: Date;
  updatedAt: Date;
}
