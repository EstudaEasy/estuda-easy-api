import { IFlashcard } from './flashcard.interface';

export class FlashcardEntity implements IFlashcard {
  constructor(props: IFlashcard) {
    Object.assign(this, props);
  }

  id: number;
  deckId: string;
  front: string;
  back: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
