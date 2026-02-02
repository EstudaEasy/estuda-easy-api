import { IQuizItem } from '../quiz-item/quiz-item.interface';

import { IQuiz } from './quiz.interface';

export class QuizEntity implements IQuiz {
  constructor(props: IQuiz) {
    Object.assign(this, props);
  }

  id: string;
  title: string;
  description?: string;
  items: IQuizItem[];
  createdAt: Date;
  updatedAt: Date;
}
