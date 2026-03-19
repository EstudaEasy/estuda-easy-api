import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { ResourceResponseDTO } from '../resource/resource-response.dto';

@Exclude()
export class ResourceFavoriteResponseDTO {
  @ApiProperty({
    description: 'ID único do favorito',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'ID do usuário dono do favorito',
    example: 10
  })
  @Expose()
  userId: number;

  @ApiProperty({
    description: 'ID do recurso favoritado',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  resourceId: string;

  @ApiProperty({
    description: 'Dados do recurso favoritado, incluindo o tipo e a entidade correspondente',
    type: ResourceResponseDTO
  })
  @Expose()
  @Type(() => ResourceResponseDTO)
  resource?: ResourceResponseDTO;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2026-01-15T10:30:00.000Z'
  })
  @Expose()
  createdAt: Date;
}
