import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Length } from 'class-validator';

import { QuizItemResponseDTO } from './quiz-item-response.dto';

export class FindQuizItemParamsDTO {
  @ApiProperty({
    description: 'ID do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  quizId: string;
}

export class FindQuizItemQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do item',
    example: 1
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({
    description: 'Pergunta do item',
    example: 'Qual é a capital do Brasil?',
    minLength: 3,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  question?: string;
}

export class FindQuizItemResponseDTO {
  @ApiProperty({ description: 'Lista de itens do quiz', type: [QuizItemResponseDTO] })
  @Type(() => QuizItemResponseDTO)
  quizItems: QuizItemResponseDTO[];

  @ApiProperty({ description: 'Total de itens encontrados', example: 10 })
  total: number;
}
