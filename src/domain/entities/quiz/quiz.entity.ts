import { QuizItemEntity } from '../quiz-item/quiz-item.entity';
import { ResourceEntity } from '../resource/resource.entity';

import { IQuiz } from './quiz.interface';

export class QuizEntity implements IQuiz {
  constructor(props: IQuiz) {
    Object.assign(this, props);
  }

  id: string;
  title: string;
  description?: string;
  resourceId: string;
  resource?: ResourceEntity;
  items: QuizItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}
