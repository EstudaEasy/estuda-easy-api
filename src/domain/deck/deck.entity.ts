import { FlashcardEntity } from '../flashcard/flashcard.entity';
import { IResource } from '../resource/resource.interface';

import { IDeck } from './deck.interface';

export class DeckEntity implements IDeck {
  constructor(props: IDeck) {
    Object.assign(this, props);
  }

  id: string;
  name: string;
  description?: string;
  resourceId: string;
  resource?: IResource;
  flashcards: FlashcardEntity[];
  createdAt: Date;
  updatedAt: Date;
}
