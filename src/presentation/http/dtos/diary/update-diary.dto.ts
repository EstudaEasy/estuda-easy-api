import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateDiaryBodyDTO } from './create-diary.dto';

export class UpdateDiaryParamsDTO {
  @ApiProperty({
    description: 'ID do diário',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  diaryId: string;
}

export class UpdateDiaryBodyDTO extends PartialType(CreateDiaryBodyDTO) {}
