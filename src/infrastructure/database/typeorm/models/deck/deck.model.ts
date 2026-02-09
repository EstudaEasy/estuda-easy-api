import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IDeck } from '@domain/entities/deck/deck.interface';

import { FlashcardModel } from '../flashcard/flashcard.model';
import { ResourceModel } from '../resource/resource.model';

@Entity({ name: 'decks' })
export class DeckModel implements IDeck {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: string;

  @OneToOne(() => ResourceModel, (resource) => resource.deck, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id', foreignKeyConstraintName: 'fk_decks_resources' })
  resource?: ResourceModel;

  @OneToMany(() => FlashcardModel, (flashcard) => flashcard.deck)
  flashcards: FlashcardModel[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
