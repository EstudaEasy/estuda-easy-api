import { IDeck } from '../deck/deck.interface';
import { IQuiz } from '../quiz/quiz.interface';
import { IResourceShare } from '../resource-share/resource-share.interface';
import { ITask } from '../task/task.interface';
import { IUser } from '../user/user.interface';

export enum ResourceType {
  DECK = 'deck',
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
  deck?: IDeck;
  quiz?: IQuiz;
  task?: ITask;
  shares?: IResourceShare[];
  createdAt: Date;
  updatedAt: Date;
}
