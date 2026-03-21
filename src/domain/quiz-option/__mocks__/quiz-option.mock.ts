import { faker } from '@faker-js/faker';

import { IQuizOption } from '../quiz-option.interface';

export class QuizOptionMock implements IQuizOption {
  public readonly id: number;
  public readonly quizItemId: number;
  public readonly text: string;
  public readonly isCorrect: boolean;
  public readonly position: number;

  constructor(partial?: Partial<IQuizOption>) {
    this.id = faker.number.int({ min: 1, max: 1000 });
    this.quizItemId = faker.number.int({ min: 1, max: 1000 });
    this.text = faker.lorem.sentence();
    this.isCorrect = faker.datatype.boolean();
    this.position = faker.number.int({ min: 1, max: 10 });
    Object.assign(this, partial);
  }

  public static getList(length: number = 4): IQuizOption[] {
    return Array.from({ length }, () => new QuizOptionMock());
  }
}
