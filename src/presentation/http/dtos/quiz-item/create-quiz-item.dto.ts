import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  ValidateNested
} from 'class-validator';

import { CreateQuizOptionDTO } from '../quiz-option';

export class CreateQuizItemParamsDTO {
  @ApiProperty({
    description: 'ID do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  quizId: string;
}

export class CreateQuizItemBodyDTO {
  @ApiProperty({
    description: 'Pergunta do item',
    example: 'Qual é a capital do Brasil?',
    minLength: 3,
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  question: string;

  @ApiProperty({
    description: 'Opções de resposta do item',
    type: [CreateQuizOptionDTO]
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizOptionDTO)
  options: CreateQuizOptionDTO[];

  @ApiProperty({
    description: 'Ordem do item no quiz',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  position: number;

  @ApiPropertyOptional({
    description: 'Tempo limite em segundos',
    example: 30
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  timeLimit?: number;

  @ApiPropertyOptional({
    description: 'Explicação da resposta',
    example: 'Brasília é a capital do Brasil desde 1960.',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  explanation?: string;
}
