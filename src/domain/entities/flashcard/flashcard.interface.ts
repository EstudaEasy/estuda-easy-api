export interface IFlashcard {
  id: number;
  deckId: string;
  front: string;
  back: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
