import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IFlashcard } from '@domain/entities/flashcard/flashcard.interface';

import { DeckModel } from '../deck/deck.model';

@Entity({ name: 'flashcards' })
export class FlashcardModel implements IFlashcard {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'deck_id', type: 'uuid' })
  deckId: string;

  @ManyToOne(() => DeckModel, (deck) => deck.flashcards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deck_id', foreignKeyConstraintName: 'fk_flashcards_decks' })
  deck?: DeckModel;

  @Column({ name: 'front', type: 'varchar' })
  front: string;

  @Column({ name: 'back', type: 'varchar' })
  back: string;

  @Column({ name: 'position', type: 'int' })
  position: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
