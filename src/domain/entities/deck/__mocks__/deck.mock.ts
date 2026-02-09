import { faker } from '@faker-js/faker';

import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';
import { IFlashcard } from '@domain/entities/flashcard/flashcard.interface';

import { IDeck } from '../deck.interface';

export class DeckMock implements IDeck {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly resourceId: string;
  public readonly flashcards: IFlashcard[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IDeck>) {
    this.id = faker.string.uuid();
    this.name = faker.lorem.words(3);
    this.description = faker.lorem.sentence();
    this.resourceId = faker.string.uuid();
    this.flashcards = FlashcardMock.getList(faker.number.int({ min: 1, max: 10 }));
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): IDeck[] {
    return Array.from({ length }, () => new DeckMock());
  }
}
