import { IQuizItem } from '../quiz-item/quiz-item.interface';
import { IResource } from '../resource/resource.interface';

export interface IQuiz {
  id: string;
  title: string;
  description?: string;
  resourceId: string;
  resource?: IResource;
  items: IQuizItem[];
  createdAt: Date;
  updatedAt: Date;
}
