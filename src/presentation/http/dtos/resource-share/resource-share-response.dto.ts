import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { SharePermission } from '@domain/resource-share/resource-share.interface';

@Exclude()
export class ResourceShareResponseDTO {
  @ApiProperty({
    description: 'ID único do compartilhamento',
    example: 1
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Permissão do compartilhamento',
    enum: SharePermission,
    example: SharePermission.READ
  })
  @Expose()
  permission: SharePermission;

  @ApiProperty({
    description: 'ID do recurso compartilhado',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  resourceId: string;

  @ApiProperty({
    description: 'ID do usuário com acesso',
    example: 1
  })
  @Expose()
  userId: number;

  @ApiPropertyOptional({
    description: 'Data de criação do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Data da última atualização do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  updatedAt: Date;
}
