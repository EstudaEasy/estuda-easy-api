import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateQuizOptionDTO } from './create-quiz-option.dto';

export class UpdateQuizOptionDTO extends CreateQuizOptionDTO {
  @ApiPropertyOptional({
    description: 'ID da opção (pode ser usado para atualizar uma opção existente)',
    example: 1
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;
}
