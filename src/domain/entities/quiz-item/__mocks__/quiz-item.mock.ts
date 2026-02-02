import { faker } from '@faker-js/faker';

import { QuizOptionMock } from '@domain/entities/quiz-option/__mocks__/quiz-option.mock';
import { IQuizOption } from '@domain/entities/quiz-option/quiz-option.interface';

import { IQuizItem } from '../quiz-item.interface';

export class QuizItemMock implements IQuizItem {
  public readonly id: number;
  public readonly quizId: string;
  public readonly question: string;
  public readonly options: IQuizOption[];
  public readonly position: number;
  public readonly timeLimit?: number;
  public readonly explanation?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor() {
    this.id = faker.number.int({ min: 1, max: 1000 });
    this.quizId = faker.string.uuid();
    this.question = faker.lorem.sentence();
    this.options = QuizOptionMock.getList(4);
    this.position = faker.number.int({ min: 1, max: 100 });
    this.timeLimit = faker.number.int({ min: 10, max: 300 });
    this.explanation = faker.lorem.paragraph();
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
  }

  public static getList(length: number = 2): IQuizItem[] {
    return Array.from({ length }, () => new QuizItemMock());
  }
}
