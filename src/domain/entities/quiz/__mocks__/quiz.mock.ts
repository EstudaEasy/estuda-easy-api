import { faker } from '@faker-js/faker';

import { QuizItemMock } from '@domain/entities/quiz-item/__mocks__/quiz-item.mock';
import { IQuizItem } from '@domain/entities/quiz-item/quiz-item.interface';

import { IQuiz } from '../quiz.interface';

export class QuizMock implements IQuiz {
  public readonly id: string;
  public readonly title: string;
  public readonly description?: string;
  public readonly items: IQuizItem[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor() {
    this.id = faker.string.uuid();
    this.title = faker.lorem.words(3);
    this.description = faker.lorem.sentence();
    this.items = QuizItemMock.getList(faker.number.int({ min: 1, max: 5 }));
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
  }

  public static getList(length: number = 2): IQuiz[] {
    return Array.from({ length }, () => new QuizMock());
  }
}
