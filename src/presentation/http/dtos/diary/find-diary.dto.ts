import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

import { DiaryResponseDTO } from './diary-response.dto';

export class FindDiaryQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do diário',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Título do diário',
    example: 'Meu dia de estudos',
    minLength: 3,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  title?: string;
}

export class FindDiaryResponseDTO {
  @ApiProperty({ description: 'Lista de diários', type: [DiaryResponseDTO] })
  @Type(() => DiaryResponseDTO)
  diaries: DiaryResponseDTO[];

  @ApiProperty({ description: 'Total de diários encontrados', example: 10 })
  total: number;
}
