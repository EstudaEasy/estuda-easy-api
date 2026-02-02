import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { QuizItemResponseDTO } from '../quiz-item/quiz-item-response.dto';

@Exclude()
export class QuizResponseDTO {
  @ApiProperty({
    description: 'ID único do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Título do quiz',
    example: 'Quiz de Matemática'
  })
  @Expose()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição do quiz',
    example: 'Um quiz sobre matemática básica'
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Itens do quiz',
    type: [QuizItemResponseDTO]
  })
  @Expose()
  @Type(() => QuizItemResponseDTO)
  items?: QuizItemResponseDTO[];

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
