import { QuizItemEntity } from '../quiz-item/quiz-item.entity';

import { IQuiz } from './quiz.interface';

export class QuizEntity implements IQuiz {
  constructor(props: IQuiz) {
    Object.assign(this, props);
  }

  id: string;
  title: string;
  description?: string;
  items: QuizItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}
