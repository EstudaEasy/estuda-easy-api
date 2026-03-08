import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { SharePermission } from '@domain/resource-share/resource-share.interface';

@Exclude()
export class ResourceShareLinkResponseDTO {
  @ApiProperty({
    description: 'ID único do link de compartilhamento',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'ID do recurso associado ao link',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  resourceId: string;

  @ApiProperty({
    description: 'Permissão concedida ao acessar o link',
    enum: SharePermission,
    example: SharePermission.READ
  })
  @Expose()
  permission: SharePermission;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  updatedAt: Date;
}
