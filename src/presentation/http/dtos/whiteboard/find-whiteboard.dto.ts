import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

import { WhiteboardResponseDTO } from './whiteboard-response.dto';

export class FindWhiteboardQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do whiteboard',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Título do whiteboard',
    example: 'Brainstorming de Projeto',
    minLength: 3,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;
}

export class FindWhiteboardResponseDTO {
  @ApiProperty({ description: 'Lista de whiteboards', type: [WhiteboardResponseDTO] })
  @Type(() => WhiteboardResponseDTO)
  whiteboards: WhiteboardResponseDTO[];

  @ApiProperty({ description: 'Total de whiteboards encontrados', example: 10 })
  total: number;
}
