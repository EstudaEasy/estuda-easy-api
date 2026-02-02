import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive, IsUUID, ValidateNested } from 'class-validator';

import { UpdateQuizOptionDTO } from '../quiz-option';

import { CreateQuizItemBodyDTO } from './create-quiz-item.dto';

export class UpdateQuizItemParamsDTO {
  @ApiProperty({
    description: 'ID do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  quizId: string;

  @ApiProperty({ description: 'ID do item do quiz', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quizItemId: number;
}

export class UpdateQuizItemBodyDTO extends OmitType(PartialType(CreateQuizItemBodyDTO), ['options']) {
  @ApiPropertyOptional({
    description: 'Opções de resposta do item',
    type: [UpdateQuizOptionDTO]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuizOptionDTO)
  options?: UpdateQuizOptionDTO[];
}
