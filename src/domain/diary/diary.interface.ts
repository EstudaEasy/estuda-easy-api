import { IResource } from '../resource/resource.interface';

export interface IDiary {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  resourceId: string;
  resource?: IResource;
  createdAt: Date;
  updatedAt: Date;
}
