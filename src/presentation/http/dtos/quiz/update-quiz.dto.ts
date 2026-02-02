import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateQuizBodyDTO } from './create-quiz.dto';

export class UpdateQuizParamsDTO {
  @ApiProperty({
    description: 'ID do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  quizId: string;
}

export class UpdateQuizBodyDTO extends PartialType(CreateQuizBodyDTO) {}
