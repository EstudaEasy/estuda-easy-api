import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

import { DeckResponseDTO } from './deck-response.dto';

export class FindDeckQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do deck',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Nome do deck',
    example: 'Vocabulário de Inglês',
    minLength: 3,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;
}

export class FindDeckResponseDTO {
  @ApiProperty({ description: 'Lista de decks', type: [DeckResponseDTO] })
  @Type(() => DeckResponseDTO)
  decks: DeckResponseDTO[];

  @ApiProperty({ description: 'Total de decks encontrados', example: 10 })
  total: number;
}
