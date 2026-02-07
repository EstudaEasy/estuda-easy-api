import { IQuiz } from '../quiz/quiz.interface';
import { IResourceShare } from '../resource-share/resource-share.interface';
import { IUser } from '../user/user.interface';

export enum ResourceType {
  COLLECTION = 'collection',
  DIARY = 'diary',
  QUIZ = 'quiz',
  TASK = 'task',
  WHITEBOARD = 'whiteboard'
}

export interface IResource {
  id: string;
  type: ResourceType;
  userId: number;
  user?: IUser;
  quiz?: IQuiz;
  shares?: IResourceShare[];
  createdAt: Date;
  updatedAt: Date;
}
