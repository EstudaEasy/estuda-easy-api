import { QuizOptionEntity } from '../quiz-option/quiz-option.entity';

import { IQuizItem } from './quiz-item.interface';

export class QuizItemEntity implements IQuizItem {
  constructor(props: IQuizItem) {
    Object.assign(this, props);
  }

  id: number;
  quizId: string;
  question: string;
  options: QuizOptionEntity[];
  position: number;
  timeLimit?: number;
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}
