import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { FlashcardResponseDTO } from '../flashcard/flashcard-response.dto';

@Exclude()
export class DeckResponseDTO {
  @ApiProperty({
    description: 'ID único do deck',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nome do deck',
    example: 'Vocabulário de Inglês'
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do deck',
    example: 'Flashcards para estudar vocabulário em inglês'
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Flashcards do deck',
    type: [FlashcardResponseDTO]
  })
  @Expose()
  @Type(() => FlashcardResponseDTO)
  flashcards?: FlashcardResponseDTO[];

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  updatedAt: Date;
}
