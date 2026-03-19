import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ResourceFavoriteResponseDTO } from './resource-favorite-response.dto';

export class FindResourceFavoriteResponseDTO {
  @ApiProperty({
    description: 'Lista de recursos favoritos',
    type: [ResourceFavoriteResponseDTO]
  })
  @Type(() => ResourceFavoriteResponseDTO)
  favorites: ResourceFavoriteResponseDTO[];

  @ApiProperty({ description: 'Total de recursos favoritos encontrados', example: 15 })
  total: number;
}
