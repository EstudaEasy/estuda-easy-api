import { IQuizItem } from '../quiz-item/quiz-item.interface';

export interface IQuiz {
  id: string;
  title: string;
  description?: string;
  items: IQuizItem[];
  createdAt: Date;
  updatedAt: Date;
}
