import { IFlashcard } from '../flashcard/flashcard.interface';
import { IResource } from '../resource/resource.interface';

export interface IDeck {
  id: string;
  name: string;
  description?: string;
  resourceId: string;
  resource?: IResource;
  flashcards: IFlashcard[];
  createdAt: Date;
  updatedAt: Date;
}
