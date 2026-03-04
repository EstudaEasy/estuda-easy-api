import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { ResourceShareResponseDTO } from './resource-share-response.dto';

export class FindResourceSharesParamsDTO {
  @ApiProperty({
    description: 'ID do recurso',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  resourceId: string;
}

@Exclude()
export class UserResponseDTO {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva'
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com'
  })
  @Expose()
  email: string;
}

class ResourceShareDTO extends ResourceShareResponseDTO {
  @ApiProperty({
    description: 'Informações do usuário com acesso ao recurso',
    type: UserResponseDTO
  })
  @Type(() => UserResponseDTO)
  user?: UserResponseDTO;
}

export class FindResourceSharesResponseDTO {
  @ApiProperty({
    description: 'Lista de compartilhamentos do recurso',
    type: [ResourceShareDTO]
  })
  @Type(() => ResourceShareDTO)
  shares: ResourceShareDTO[];

  @ApiProperty({
    description: 'Total de compartilhamentos',
    example: 10
  })
  total: number;
}
