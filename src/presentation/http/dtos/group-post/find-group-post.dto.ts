import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, IsUUID, Length } from 'class-validator';

import { GroupPostResponseDTO } from './group-post-response.dto';

export class FindGroupPostsParamsDTO {
  @ApiProperty({
    description: 'ID do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  groupId: string;
}

export class FindGroupPostsQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do post do grupo',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por conteúdo do post',
    example: 'revisar matemática',
    minLength: 1,
    maxLength: 5000
  })
  @IsOptional()
  @IsString()
  @Length(1, 5000)
  content?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do autor do post',
    example: 12
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  authorId?: number;
}

export class FindGroupPostsResponseDTO {
  @ApiProperty({ description: 'Lista de posts do grupo', type: [GroupPostResponseDTO] })
  @Type(() => GroupPostResponseDTO)
  posts: GroupPostResponseDTO[];

  @ApiProperty({ description: 'Total de posts encontrados', example: 25 })
  total: number;
}
