import { ResourceEntity } from '../resource/resource.entity';

import { IDiary } from './diary.interface';

export class DiaryEntity implements IDiary {
  constructor(props: IDiary) {
    Object.assign(this, props);
  }

  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  resourceId: string;
  resource?: ResourceEntity;
  createdAt: Date;
  updatedAt: Date;
}
