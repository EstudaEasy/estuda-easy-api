import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Length } from 'class-validator';

import { FlashcardResponseDTO } from './flashcard-response.dto';

export class FindFlashcardParamsDTO {
  @ApiProperty({
    description: 'ID do deck',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  deckId: string;
}

export class FindFlashcardQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do flashcard',
    example: 1
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({
    description: 'Frente do flashcard (pergunta)',
    example: 'Qual é a capital da França?',
    minLength: 1,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  front?: string;
}

export class FindFlashcardResponseDTO {
  @ApiProperty({ description: 'Lista de flashcards', type: [FlashcardResponseDTO] })
  @Type(() => FlashcardResponseDTO)
  flashcards: FlashcardResponseDTO[];

  @ApiProperty({ description: 'Total de flashcards encontrados', example: 10 })
  total: number;
}
