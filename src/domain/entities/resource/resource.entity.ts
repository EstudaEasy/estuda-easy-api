import { QuizEntity } from '../quiz/quiz.entity';
import { ResourceShareEntity } from '../resource-share/resource-share.entity';
import { TaskEntity } from '../task/task.entity';
import { UserEntity } from '../user/user.entity';

import { IResource, ResourceType } from './resource.interface';

export class ResourceEntity implements IResource {
  constructor(props: IResource) {
    Object.assign(this, props);
  }

  id: string;
  type: ResourceType;
  userId: number;
  user?: UserEntity;
  quiz?: QuizEntity;
  task?: TaskEntity;
  shares?: ResourceShareEntity[];
  createdAt: Date;
  updatedAt: Date;
}
