import { faker } from '@faker-js/faker';

import { IFlashcard } from '../flashcard.interface';

export class FlashcardMock implements IFlashcard {
  public readonly id: number;
  public readonly deckId: string;
  public readonly front: string;
  public readonly back: string;
  public readonly position: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IFlashcard>) {
    this.id = faker.number.int({ min: 1, max: 1000 });
    this.deckId = faker.string.uuid();
    this.front = faker.lorem.sentence();
    this.back = faker.lorem.paragraph();
    this.position = faker.number.int({ min: 1, max: 100 });
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): IFlashcard[] {
    return Array.from({ length }, () => new FlashcardMock());
  }
}
