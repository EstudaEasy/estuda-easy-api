import { IQuizOption } from '../quiz-option/quiz-option.interface';

export interface IQuizItem {
  id: number;
  quizId: string;
  question: string;
  options: IQuizOption[];
  position: number;
  timeLimit?: number;
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}
