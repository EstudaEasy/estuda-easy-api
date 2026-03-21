import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

import { QuizResponseDTO } from './quiz-response.dto';

export class FindQuizQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Título do quiz',
    example: 'Quiz de Matemática',
    minLength: 3,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;
}

export class FindQuizResponseDTO {
  @ApiProperty({ description: 'Lista de quizzes', type: [QuizResponseDTO] })
  @Type(() => QuizResponseDTO)
  quizzes: QuizResponseDTO[];

  @ApiProperty({ description: 'Total de quizzes encontrados', example: 10 })
  total: number;
}
