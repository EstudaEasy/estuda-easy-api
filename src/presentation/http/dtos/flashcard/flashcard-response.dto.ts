import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FlashcardResponseDTO {
  @ApiProperty({
    description: 'ID único do flashcard',
    example: 1
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'ID do deck',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  deckId: string;

  @ApiProperty({
    description: 'Frente do flashcard (pergunta)',
    example: 'Qual é a capital da França?'
  })
  @Expose()
  front: string;

  @ApiProperty({
    description: 'Verso do flashcard (resposta)',
    example: 'Paris'
  })
  @Expose()
  back: string;

  @ApiProperty({
    description: 'Posição do flashcard no deck',
    example: 1
  })
  @Expose()
  position: number;

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
