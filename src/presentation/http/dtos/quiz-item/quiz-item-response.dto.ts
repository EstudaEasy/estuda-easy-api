import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { QuizOptionResponseDTO } from '../quiz-option';

@Exclude()
export class QuizItemResponseDTO {
  @ApiProperty({
    description: 'ID único do item',
    example: 1
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'ID do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  quizId: string;

  @ApiProperty({
    description: 'Pergunta do item',
    example: 'Qual é a capital do Brasil?'
  })
  @Expose()
  question: string;

  @ApiPropertyOptional({
    description: 'Opções de resposta',
    type: [QuizOptionResponseDTO]
  })
  @Expose()
  @Type(() => QuizOptionResponseDTO)
  options?: QuizOptionResponseDTO[];

  @ApiProperty({
    description: 'Ordem do item no quiz',
    example: 1
  })
  @Expose()
  position: number;

  @ApiPropertyOptional({
    description: 'Tempo limite em segundos',
    example: 30
  })
  @Expose()
  timeLimit?: number;

  @ApiPropertyOptional({
    description: 'Explicação da resposta',
    example: 'Brasília é a capital do Brasil desde 1960.'
  })
  @Expose()
  explanation?: string;

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
