import { IResource } from '../resource/resource.interface';

import { IWhiteboard } from './whiteboard.interface';

export class WhiteboardEntity implements IWhiteboard {
  constructor(props: IWhiteboard) {
    Object.assign(this, props);
  }

  id: string;
  title: string;
  content: any;
  resourceId: string;
  resource?: IResource;
  createdAt: Date;
  updatedAt: Date;
}
