import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

import { GroupResponseDTO } from './group-response.dto';

export class FindGroupQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Nome do grupo',
    example: 'Grupo de Estudos',
    minLength: 3,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Código de convite do grupo',
    example: 'ABC12345'
  })
  @IsOptional()
  @IsString()
  inviteCode?: string;
}

export class FindGroupResponseDTO {
  @ApiProperty({ description: 'Lista de grupos', type: [GroupResponseDTO] })
  @Type(() => GroupResponseDTO)
  groups: GroupResponseDTO[];

  @ApiProperty({ description: 'Total de grupos encontrados', example: 10 })
  total: number;
}
